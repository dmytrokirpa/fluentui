import { createRuntimeScriptLoader, loadRuntimeManifest, resolveManifestPath } from './runtime';
import type { ResolvedPlaygroundRuntimeManifest } from './runtime';

const PAGE = 'https://example.com/storybook/playground/app/playground.html?manifest=x#code=abc';
const FALLBACK = '../runtime/manifest.json';

describe('resolveManifestPath', () => {
  it('uses the fallback without an override', () => {
    expect(resolveManifestPath(null, PAGE, FALLBACK)).toBe(FALLBACK);
    expect(resolveManifestPath('', PAGE, FALLBACK)).toBe(FALLBACK);
  });

  it('accepts same-origin overrides', () => {
    expect(resolveManifestPath('/other/runtime/manifest.json', PAGE, FALLBACK)).toBe(
      'https://example.com/other/runtime/manifest.json',
    );
    expect(resolveManifestPath('../../next/manifest.json', PAGE, FALLBACK)).toBe(
      'https://example.com/storybook/next/manifest.json',
    );
  });

  it('rejects cross-origin and non-http overrides', () => {
    expect(resolveManifestPath('https://attacker.example/manifest.json', PAGE, FALLBACK)).toBe(FALLBACK);
    expect(resolveManifestPath('//attacker.example/manifest.json', PAGE, FALLBACK)).toBe(FALLBACK);
    expect(resolveManifestPath('data:application/json,{}', PAGE, FALLBACK)).toBe(FALLBACK);
  });
});

describe('runtime script loading', () => {
  const runtimeUrl = 'https://example.com/storybook/runtime.js';
  const lazyUrl = 'https://example.com/storybook/lazy.js';
  const manifest: ResolvedPlaygroundRuntimeManifest = {
    allowedModules: [],
    baseUrl: 'https://example.com/storybook/',
    buildId: 'test',
    scripts: [runtimeUrl],
    scriptFiles: [runtimeUrl, lazyUrl, 'https://cdn.example.net/runtime.js'],
    styles: [],
    typings: 'https://example.com/storybook/playground/runtime/typings.json',
  };
  const scriptSource = 'throw new Error("This must not execute in the shell");';
  const response = {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: { get: () => 'text/javascript' },
    text: async () => scriptSource,
  };

  it('resolves eager and lazy script URLs relative to a nested Storybook deployment', async () => {
    const fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ...manifest,
        scripts: ['runtime.js'],
        scriptFiles: ['runtime.js', 'lazy.js'],
        typings: 'playground/runtime/typings.json',
      }),
    });

    const result = await loadRuntimeManifest({ fetch, location: { href: PAGE } }, '../runtime/manifest.json');

    expect(result.baseUrl).toBe(manifest.baseUrl);
    expect(result.scripts).toEqual([runtimeUrl]);
    expect(result.scriptFiles).toEqual([runtimeUrl, lazyUrl]);
  });

  it('fetches and caches approved script text without evaluating it or following redirects', async () => {
    const fetch = jest.fn().mockResolvedValue(response);
    const controller = new AbortController();
    const loadScript = createRuntimeScriptLoader(
      { fetch, location: { origin: 'https://example.com' } },
      manifest,
      controller.signal,
    );

    await expect(Promise.all([loadScript(runtimeUrl), loadScript(runtimeUrl)])).resolves.toEqual([
      scriptSource,
      scriptSource,
    ]);
    await expect(loadScript(lazyUrl)).resolves.toBe(scriptSource);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith(runtimeUrl, {
      mode: 'same-origin',
      credentials: 'same-origin',
      redirect: 'error',
      signal: controller.signal,
    });
  });

  it.each([
    'https://example.com/private',
    `${lazyUrl}?private=1`,
    'https://cdn.example.net/runtime.js',
    'data:text/javascript,alert(1)',
    '../runtime.js',
  ])('rejects non-manifest and cross-origin requests without fetching: %s', async url => {
    const fetch = jest.fn();
    const loadScript = createRuntimeScriptLoader({ fetch, location: { origin: 'https://example.com' } }, manifest);

    await expect(loadScript(url)).rejects.toThrow('not an allowed same-origin asset');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('reports HTTP failures and permits retrying a failed request', async () => {
    const fetch = jest
      .fn()
      .mockResolvedValueOnce({ ...response, ok: false, status: 503, statusText: 'Service Unavailable' })
      .mockResolvedValueOnce(response);
    const loadScript = createRuntimeScriptLoader({ fetch, location: { origin: 'https://example.com' } }, manifest);

    await expect(loadScript(runtimeUrl)).rejects.toThrow('503 Service Unavailable');
    await expect(loadScript(runtimeUrl)).resolves.toBe(scriptSource);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('rejects login pages and host fallback HTML instead of treating them as runtime code', async () => {
    const fetch = jest.fn().mockResolvedValue({ ...response, headers: { get: () => 'text/html; charset=utf-8' } });
    const loadScript = createRuntimeScriptLoader({ fetch, location: { origin: 'https://example.com' } }, manifest);

    await expect(loadScript(runtimeUrl)).rejects.toThrow('returned HTML instead of JavaScript');
  });
});
