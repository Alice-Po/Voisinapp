module.exports = {
    default: {
      require: ['tests/steps/*.ts'],
      format: ['progress', 'html:cucumber-report.html'],
      parallel: 2
    }
  };