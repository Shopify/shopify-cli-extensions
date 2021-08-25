function createScriptUrl(script) {
  return typeof window === 'undefined' || typeof script !== 'string' ? undefined : new URL(script, window.location.href);
}

export { createScriptUrl };
