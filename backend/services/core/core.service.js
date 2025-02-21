const path = require('path');
const { CoreService } = require('@semapps/core');
const { apods, notify, interop, oidc, skos } = require('@semapps/ontologies');
const CONFIG = require('../../config/config');

// Définition de notre contexte personnalisé
const customContext = {
  "@context": {
    "@vocab": "http://www.w3.org/ns/activitystreams#",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "schema": "http://schema.org/",
    "color": {
      "@id": "schema:color",
      "@type": "http://www.w3.org/2001/XMLSchema#string"
    },
    "prefLabel": {
      "@id": "skos:prefLabel",
      "@type": "http://www.w3.org/2001/XMLSchema#string"
    }
  }
};

module.exports = {
  mixins: [CoreService],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    baseDir: path.resolve(__dirname, '../..'),
    triplestore: {
      url: CONFIG.SPARQL_ENDPOINT,
      user: CONFIG.JENA_USER,
      password: CONFIG.JENA_PASSWORD,
      mainDataset: CONFIG.MAIN_DATASET
    },
    ontologies: [apods, notify, interop, oidc, skos],
    activitypub: {
      queueServiceUrl: CONFIG.QUEUE_SERVICE_URL,
      context: customContext
    },
    api: {
      port: CONFIG.PORT
    },
    ldp: {
      resourcesWithContainerPath: false
    },
    void: false,
    webid: false
  }
};
