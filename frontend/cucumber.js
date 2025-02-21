export default {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/step_definitions/*.js', 'features/support/*.js'],
    format: ['progress-bar', 'html:cucumber-report.html'],
    publishQuiet: true
  }
}; 