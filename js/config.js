const config = (function () {
  function laymanConfig() {
    return {
      randomShuffle: true, // Set to true or false based on your requirement
    };
  }

  function expertConfig() {
    return {
      randomShuffle: true, // Set to true or false based on your requirement
    };
  }

  return {
    laymanConfig,
    expertConfig,
  };
})();
