import * as React from 'react';
import { canUseDOM } from '@fluentui/react-utilities';
import { createRoot } from 'react-dom/client';

import { readPlaygroundHash } from '../url';
import { Playground } from './Playground';
import { DEFAULT_MANIFEST_PATH, loadRuntimeManifest } from './runtime';

if (!canUseDOM()) {
  throw new Error('Playground requires a browser environment');
}

const targetDocument = globalThis.document;
const targetWindow = targetDocument.defaultView;
const container = targetDocument.getElementById('root');

if (!container || !targetWindow) {
  throw new Error('Playground browser environment is incomplete');
}

const { state: initialState, issues: initialIssues } = readPlaygroundHash(targetWindow.location.hash);

(async () => {
  try {
    const requestedManifest = new URLSearchParams(targetWindow.location.search).get('manifest');
    const manifest = await loadRuntimeManifest(targetWindow, requestedManifest || DEFAULT_MANIFEST_PATH);
    createRoot(container).render(
      <React.StrictMode>
        <Playground
          initialCode={initialState?.code ?? null}
          initialCssModules={initialState?.cssModules}
          initialIssues={initialIssues}
          initialTitle={initialState?.title}
          manifest={manifest}
        />
      </React.StrictMode>,
    );
  } catch (error) {
    container.textContent = error instanceof Error ? error.message : String(error);
  }
})();
