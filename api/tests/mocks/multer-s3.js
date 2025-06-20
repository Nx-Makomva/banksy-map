module.exports = {
  single: () => (req, res, next) => next()
};

// This mock does nothing, just passes through 
// so we can run tests that require access to the bucket 
// without adding anything to the actual bucket