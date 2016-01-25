export default function inject(entries, module) {
  if (typeof entries === 'string') {
    return [ ...module, entries ];
  } else if (Array.isArray(entries)) {
    return [ ...module, ...entries ];
  } else if (typeof entries === 'object') {
    const res = { };
    for (const key of Object.keys(entries)) {
      res[key] = inject(entries[key], module);
    }
    return res;
  }
  throw new TypeError();
}
