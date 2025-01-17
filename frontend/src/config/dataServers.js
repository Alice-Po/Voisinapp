const dataServers = {
  pod: {
    pod: true,
    default: true,
    authServer: true,
    baseUrl: null, // Calculated from the token
    sparqlEndpoint: null,
    containers: {
      pod: {
        'as:Note': ['/as/note'],
        'vcard:Location': ['/vcard/location'],
        'vcard:Individual': ['/vcard/profile'],
        'vcard:Group': ['/vcard/group']
      }
    },
    uploadsContainer: '/semapps/file'
  },
  app: {
    baseUrl: 'http://localhost:3004',
    sparqlEndpoint: 'http://localhost:3004/sparql',
    containers: {
      app: {
        'skos:Concept': ['/taxonomy']
      }
    }
  }
};

export default dataServers;
