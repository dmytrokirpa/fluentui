import type { PlaygroundRuntimeManifest, PlaygroundSetupMetadata } from '../setup';
import type { PlaygroundConsoleLevel } from './sandbox';

export interface ResolvedPlaygroundRuntimeManifest extends PlaygroundRuntimeManifest {
  baseUrl: string;
  /** Contents of `inlineStylesFile`, with `href` resolved against `baseUrl`. */
  inlineStyles?: Array<{ href: string; cssText: string }>;
  scripts: string[];
  styles: string[];
  typings: string;
}

export type PlaygroundRuntimeErrorKind = 'import' | 'runtime' | 'export';

export type PlaygroundRuntimeMessage =
  | {
      source: 'fluentui-playground';
      token: string;
      type: 'ready';
      metadata: PlaygroundSetupMetadata;
    }
  | {
      source: 'fluentui-playground';
      token: string;
      type: 'script-request';
      requestId: number;
      url: string;
    }
  | {
      source: 'fluentui-playground';
      token: string;
      /** The runtime failed before registering, e.g. a setup module threw or a runtime script did not load. */
      type: 'init-error';
      message: string;
    }
  | {
      source: 'fluentui-playground';
      token: string;
      type: 'success';
      runId: number;
    }
  | {
      source: 'fluentui-playground';
      token: string;
      type: 'error';
      runId: number;
      kind: PlaygroundRuntimeErrorKind;
      message: string;
      previewRetained?: boolean;
    }
  | {
      source: 'fluentui-playground';
      token: string;
      type: 'console';
      level: PlaygroundConsoleLevel;
      /** Run that was active when the message was logged, `0` before the first run. */
      runId: number;
      message: string;
    };

/** Path to the Storybook-emitted runtime, relative to `playground/app/playground.html`. */
export const DEFAULT_MANIFEST_PATH = '../runtime/manifest.json';
const MANIFEST_FILE = 'playground/runtime/manifest.json';
const SHELL_FILE = '/playground/app/playground.html';
// Encoded separators, dots and percent signs can be decoded differently by a reverse proxy and the browser.
const UNSAFE_URL_CHARACTERS = /[\\\u0000-\u0020\u007f]|%(?:2e|2f|5c|25|00|3f|23)/i;
const JAVASCRIPT_MIME_TYPES = new Set([
  'application/javascript',
  'application/ecmascript',
  'application/x-javascript',
  'text/javascript',
  'text/ecmascript',
]);

/**
 * A normally mounted shell can only use its own build. A standalone shell can explicitly select a same-origin build
 * (`?manifest=`), but its manifest must still be at the addon's emitted location.
 */
function getManifestUrl(manifestPath: string, pageUrl: string): URL {
  const page = new URL(pageUrl);
  const manifest = new URL(manifestPath, page);
  const buildRoot = page.pathname.endsWith(SHELL_FILE) ? new URL('../../', page) : new URL('../../', manifest);
  if (
    UNSAFE_URL_CHARACTERS.test(manifestPath) ||
    !/^https?:$/.test(manifest.protocol) ||
    manifest.origin !== page.origin ||
    manifest.username ||
    manifest.password ||
    manifest.search ||
    manifest.hash ||
    (manifestPath !== DEFAULT_MANIFEST_PATH && /(?:^|\/)\.{1,2}(?:\/|$)/.test(manifestPath)) ||
    manifest.pathname !== new URL(MANIFEST_FILE, buildRoot).pathname
  ) {
    throw new Error('Playground runtime manifest must be at playground/runtime/manifest.json in the selected build.');
  }
  if (new URL(decodeURIComponent(manifest.pathname), manifest).pathname !== manifest.pathname) {
    throw new Error('Playground runtime manifest must have a canonical build path.');
  }
  return manifest;
}

function resolveBuildAsset(asset: string, buildRoot: URL, extension: RegExp): string {
  const resolved = new URL(asset, buildRoot);
  if (
    UNSAFE_URL_CHARACTERS.test(asset) ||
    /(?:^|\/)\.{1,2}(?:\/|$)/.test(asset) ||
    resolved.origin !== buildRoot.origin ||
    resolved.username ||
    resolved.password ||
    resolved.search ||
    resolved.hash ||
    !resolved.pathname.startsWith(buildRoot.pathname) ||
    !extension.test(resolved.pathname)
  ) {
    throw new Error(`Playground runtime asset is outside the selected build or has an invalid path: ${asset}`);
  }
  if (new URL(decodeURIComponent(resolved.pathname), resolved).pathname !== resolved.pathname) {
    throw new Error(`Playground runtime asset must have a canonical build path: ${asset}`);
  }
  return resolved.href;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string' && item.length > 0);
}

function isRuntimeManifest(value: unknown): value is PlaygroundRuntimeManifest {
  if (!isRecord(value)) {
    return false;
  }
  const { scripts, scriptFiles, styles, typings, moduleTypings, inlineStylesFile, allowedModules, buildId } = value;
  return (
    isStringArray(scripts) &&
    scripts.length > 0 &&
    (scriptFiles === undefined ||
      (isStringArray(scriptFiles) && scripts.every(script => scriptFiles.includes(script)))) &&
    isStringArray(styles) &&
    typeof typings === 'string' &&
    typings.length > 0 &&
    (moduleTypings === undefined || (isRecord(moduleTypings) && Object.values(moduleTypings).every(isStringArray))) &&
    (inlineStylesFile === undefined || (typeof inlineStylesFile === 'string' && inlineStylesFile.length > 0)) &&
    isStringArray(allowedModules) &&
    typeof buildId === 'string' &&
    buildId.length > 0
  );
}

function isInlineStyles(value: unknown): value is Array<{ href: string; cssText: string }> {
  return (
    Array.isArray(value) &&
    value.every(style => isRecord(style) && typeof style.href === 'string' && typeof style.cssText === 'string')
  );
}

async function fetchJson(targetWindow: Pick<Window, 'fetch'>, url: URL | string, label: string): Promise<unknown> {
  const response = await targetWindow.fetch(url, {
    mode: 'same-origin',
    credentials: 'same-origin',
    redirect: 'error',
  });
  if (!response.ok) {
    throw new Error(`Failed to load playground ${label} (${response.status} ${response.statusText})`);
  }
  if (response.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
    throw new Error(`Playground ${label} did not return application/json.`);
  }
  return response.json();
}

/**
 * Fetches the Storybook-emitted playground runtime manifest and resolves asset URLs against the Storybook root.
 */
export async function loadRuntimeManifest(
  targetWindow: Pick<Window, 'fetch'> & { location: Pick<Location, 'href'> },
  manifestPath: string,
): Promise<ResolvedPlaygroundRuntimeManifest> {
  const manifestUrl = getManifestUrl(manifestPath, targetWindow.location.href);
  const manifest = await fetchJson(targetWindow, manifestUrl, 'runtime manifest');
  if (!isRuntimeManifest(manifest)) {
    throw new Error('Playground runtime manifest has an invalid shape.');
  }
  // `playground/app/playground.html` and `playground/runtime/manifest.json` are both two levels below Storybook root.
  const storybookRoot = new URL('../../', manifestUrl);
  const scriptUrl = (asset: string) => resolveBuildAsset(asset, storybookRoot, /\.m?js$/);
  const styleUrl = (asset: string) => resolveBuildAsset(asset, storybookRoot, /\.css$/);
  const runtimeJsonUrl = (asset: string) => {
    const url = resolveBuildAsset(asset, storybookRoot, /\.json$/);
    if (!new URL(url).pathname.startsWith(new URL('playground/runtime/', storybookRoot).pathname)) {
      throw new Error(`Playground runtime data is outside playground/runtime/: ${asset}`);
    }
    return url;
  };
  let inlineStyles: ResolvedPlaygroundRuntimeManifest['inlineStyles'];
  if (manifest.inlineStylesFile) {
    const styles = await fetchJson(targetWindow, runtimeJsonUrl(manifest.inlineStylesFile), 'inline styles');
    if (!isInlineStyles(styles)) {
      throw new Error('Playground runtime inline styles have an invalid shape.');
    }
    inlineStyles = styles.map(style => ({ href: styleUrl(style.href), cssText: style.cssText }));
  }

  return {
    allowedModules: manifest.allowedModules,
    buildId: manifest.buildId,
    baseUrl: storybookRoot.href,
    scripts: manifest.scripts.map(scriptUrl),
    scriptFiles: manifest.scriptFiles?.map(scriptUrl),
    styles: manifest.styles.map(styleUrl),
    inlineStylesFile: manifest.inlineStylesFile,
    inlineStyles,
    typings: runtimeJsonUrl(manifest.typings),
    moduleTypings: manifest.moduleTypings
      ? Object.fromEntries(
          Object.entries(manifest.moduleTypings).map(([moduleName, urls]) => [moduleName, urls.map(runtimeJsonUrl)]),
        )
      : undefined,
  };
}

/**
 * Fetches only exact manifest-listed JavaScript URLs inside the selected build; never evaluates code in the shell.
 * `loadRuntimeManifest` already validated every listed URL; the canonical check below guards hand-built manifests.
 */
export function createRuntimeScriptLoader(
  targetWindow: Pick<Window, 'fetch'> & { location: Pick<Location, 'origin'> },
  manifest: ResolvedPlaygroundRuntimeManifest,
  signal?: AbortSignal,
): (url: string) => Promise<string> {
  const allowed = new Set([...(manifest.scriptFiles ?? []), ...manifest.scripts]);
  const requests = new Map<string, Promise<string>>();

  return async url => {
    const buildRoot = new URL(manifest.baseUrl);
    if (!allowed.has(url) || buildRoot.origin !== targetWindow.location.origin) {
      throw new Error(`Playground runtime script is not an allowed build asset: ${url}`);
    }
    if (resolveBuildAsset(url, buildRoot, /\.m?js$/) !== url) {
      throw new Error(`Playground runtime script is not a canonical build asset: ${url}`);
    }

    let request = requests.get(url);
    if (!request) {
      request = targetWindow
        .fetch(url, { mode: 'same-origin', credentials: 'same-origin', redirect: 'error', signal })
        .then(async response => {
          if (!response.ok) {
            throw new Error(
              `Failed to load playground runtime script "${url}" (${response.status} ${response.statusText})`,
            );
          }
          const contentType = response.headers.get('content-type');
          if (!JAVASCRIPT_MIME_TYPES.has(contentType?.split(';', 1)[0].trim().toLowerCase() ?? '')) {
            throw new Error(
              `Playground runtime script "${url}" returned ${
                contentType ? JSON.stringify(contentType) : 'no Content-Type'
              } instead of JavaScript.`,
            );
          }
          return response.text();
        });
      requests.set(url, request);
      request.catch(() => requests.delete(url));
    }

    return request;
  };
}
