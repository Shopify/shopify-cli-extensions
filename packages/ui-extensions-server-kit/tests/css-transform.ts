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

export default idObj;
