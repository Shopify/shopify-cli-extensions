// Configurable
// Add new node module to create this dynamically from yml
const configs = {
  // How should this be configured? object or array or both?
  // Ref: https://github.com/Shopify/ui-extensions/blob/d69ad1ab69e728e5601953c7c199111f84d9a481/packages/checkout-ui-extensions-run/src/webpack-config.ts#L219
  entryPoints: {main: "src/index.tsx"},
  outdir: "build/",
  define: {
    'process.env.SOME_VAR': '"foo"',
  }
};

const mode = process.env.NODE_ENV;

const settings = {
  ...configs,
  define: {
    // Required for Checkout
    'process.env.NODE_ENV': JSON.stringify(mode),
    ...configs.define,
  },
  loader: {
    ".esnext": "ts",
  },
  bundle: true,
  target: "es6",
  resolveExtensions: [
    ".tsx",
    ".ts",
    ".js",
    ".json",
    ".esnext",
    ".mjs",
    ".ejs",
  ],
  logLevel: "info",
  legalComments: 'linked',
};

require("esbuild")
  .build({...settings, watch: mode === 'development', minify: mode !== 'development'})
  .catch(() => process.exit(1));