const idObj = new Proxy(
  {},
  {
    get: (_, key) => {
      if (key === '__esModule') {
        return false;
      }
      return key;
    },
  },
);

// eslint-disable-next-line no-undef
module.exports = idObj;
