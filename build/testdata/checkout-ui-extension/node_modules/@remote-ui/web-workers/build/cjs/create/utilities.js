'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function createScriptUrl(script) {
  return typeof window === 'undefined' || typeof script !== 'string' ? undefined : new URL(script, window.location.href);
}

exports.createScriptUrl = createScriptUrl;
