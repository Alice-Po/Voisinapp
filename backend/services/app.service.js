const urlJoin = require('url-join');
const { AppService } = require('@activitypods/app');
const CONFIG = require('../config/config');

// For documentation, see: https://docs.activitypods.org/app-framework/backend/application-registration/
module.exports = {
  mixins: [AppService],
  settings: {
    app: {
      name: CONFIG.APP_NAME,
      description: {
        en: 'A Mastodon-compatible app that saves all data in a Pod',
        fr: 'Une appli compatible avec Mastodon qui enregistre tout dans votre Pod'
      },
      thumbnail: urlJoin(CONFIG.FRONT_URL, 'logo192.png'),
      frontUrl: CONFIG.FRONT_URL,
      supportedLocales: ['en', 'fr']
    },
    oidc: {
      clientUri: CONFIG.FRONT_URL,
      redirectUris: urlJoin(CONFIG.FRONT_URL, 'auth-callback'),
      postLogoutRedirectUris: urlJoin(CONFIG.FRONT_URL, 'login?logout=true'),
      tosUri: null
    },
    accessNeeds: {
      required: [
        {
          registeredClass: 'as:Note',
          accessMode: ['acl:Read', 'acl:Write'],
          fields: {
            'as:content': ['acl:Read', 'acl:Write'],
            'as:tag': ['acl:Read', 'acl:Write'],
            'as:location': ['acl:Read', 'acl:Write']
          }
        },
        {
          // Ajout de la configuration pour les Tags
          registeredClass: 'as:Tag',
          accessMode: ['acl:Read', 'acl:Write'],
          fields: {
            'as:name': ['acl:Read', 'acl:Write'],
            'as:color': ['acl:Read', 'acl:Write'],
            'as:id': ['acl:Read', 'acl:Write']
          }
        },
        {
          registeredClass: 'vcard:Individual',
          accessMode: 'acl:Read'
        },
        'apods:ReadInbox',
        'apods:ReadOutbox',
        'apods:PostOutbox',
        'apods:QuerySparqlEndpoint',
        'apods:CreateWacGroup',
        'apods:CreateCollection',
        'apods:UpdateWebId'
      ],
      optional: []
    },
    classDescriptions: {
      'as:Note': {
        label: {
          en: 'Messages',
          fr: 'Messages'
        },
        openEndpoint: urlJoin(CONFIG.FRONT_URL, '/r')
      },
      'as:Tag': {  // Ajout de la description des tags
        label: {
          en: 'Tags',
          fr: 'Étiquettes'
        },
        openEndpoint: urlJoin(CONFIG.FRONT_URL, '/tags')
      }
    },
    queueServiceUrl: CONFIG.QUEUE_SERVICE_URL
  }
};
