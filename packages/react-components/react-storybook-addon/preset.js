export function previewAnnotations(entry = []) {
  return [...entry, require.resolve('./lib/preset/preview')];
}

export function managerEntries(entry = []) {
  return [...entry, require.resolve('./lib/preset/manager')];
}
