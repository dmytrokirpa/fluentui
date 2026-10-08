import type { PlaygroundRuntimeManifest, PlaygroundSetupMetadata } from '../setup';
import type { PlaygroundConsoleLevel } from './sandbox';

export interface ResolvedPlaygroundRuntimeManifest extends PlaygroundRuntimeManifest {
  baseUrl: string;
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

/**
 * Resolves the `?manifest=` override (used to point a standalone shell at a Storybook runtime). Only same-origin
 * manifests are accepted, so a crafted link cannot load scripts and typings from another site.
 */
export function resolveManifestPath(requested: string | null, pageUrl: string, fallback: string): string {
  if (!requested) {
    return fallback;
  }

  try {
    const page = new URL(pageUrl);
    const resolved = new URL(requested, page);

    return resolved.origin === page.origin ? resolved.href : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Fetches the Storybook-emitted playground runtime manifest and resolves asset URLs against the Storybook root.
 */
export async function loadRuntimeManifest(
  targetWindow: Pick<Window, 'fetch'> & { location: Pick<Location, 'href'> },
  manifestPath: string,
): Promise<ResolvedPlaygroundRuntimeManifest> {
  const manifestUrl = new URL(manifestPath, targetWindow.location.href);
  const response = await targetWindow.fetch(manifestUrl);

  if (!response.ok) {
    throw new Error(`Failed to load playground runtime (${response.status} ${response.statusText})`);
  }

  const manifest = (await response.json()) as PlaygroundRuntimeManifest;
  // `playground/app/playground.html` and `playground/runtime/manifest.json` are both two levels below Storybook root.
  const storybookRoot = new URL('../../', manifestUrl);

  return {
    ...manifest,
    baseUrl: storybookRoot.href,
    scripts: manifest.scripts.map(script => new URL(script, storybookRoot).href),
    scriptFiles: manifest.scriptFiles?.map(script => new URL(script, storybookRoot).href),
    styles: manifest.styles.map(style => new URL(style, storybookRoot).href),
    typings: new URL(manifest.typings, storybookRoot).href,
    moduleTypings: manifest.moduleTypings
      ? Object.fromEntries(
          Object.entries(manifest.moduleTypings).map(([moduleName, urls]) => [
            moduleName,
            urls.map(url => new URL(url, storybookRoot).href),
          ]),
        )
      : undefined,
  };
}

/** Fetches only manifest-listed, same-origin runtime scripts; never evaluates code in the shell. */
export function createRuntimeScriptLoader(
  targetWindow: Pick<Window, 'fetch'> & { location: Pick<Location, 'origin'> },
  manifest: ResolvedPlaygroundRuntimeManifest,
  signal?: AbortSignal,
): (url: string) => Promise<string> {
  const allowed = new Set([...(manifest.scriptFiles ?? []), ...manifest.scripts]);
  const requests = new Map<string, Promise<string>>();

  return async url => {
    if (!allowed.has(url) || new URL(url).origin !== targetWindow.location.origin) {
      throw new Error(`Playground runtime script is not an allowed same-origin asset: ${url}`);
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
          if (response.headers.get('content-type')?.toLowerCase().startsWith('text/html')) {
            throw new Error(`Playground runtime script "${url}" returned HTML instead of JavaScript.`);
          }
          return response.text();
        });
      requests.set(url, request);
      request.catch(() => requests.delete(url));
    }

    return request;
  };
}
