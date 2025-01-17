const { ControlledContainerMixin } = require('@semapps/ldp');

module.exports = {
  name: 'taxonomy',
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/taxonomy',
    acceptedTypes: ['skos:Concept']
  },
  permissions: {
    anon: {
      read: true,
      write: false,
    },
    anyUser: {
      read: true,
      write: true,
    }
  }
}