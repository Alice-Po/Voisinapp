const { ControlledContainerMixin } = require('@semapps/ldp');
const urlJoin = require('url-join');

module.exports = {
  name: 'tags',
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/tags',
    acceptedTypes: ['as:tag'],
    dereference: [],
    containerUri: null,
    context: {
      '@vocab': 'http://www.w3.org/ns/activitystreams#',
      name: 'as:name',
      color: 'as:color'
    },
    permissions: {
      read: ['anon'],
      write: ['authenticated']
    }
  },
  actions: {
    async createIfNotExists(ctx) {
      const { name, color } = ctx.params;
      console.log('Création/récupération du tag:', { name, color });

      try {
        // Chercher si le tag existe déjà
        const existingTags = await this.actions.list(ctx);
        const existingTag = existingTags.find(t => t.name === name);
        
        if (existingTag) {
          console.log('Tag existant trouvé:', existingTag);
          return existingTag;
        }

        // Créer le nouveau tag
        const tagData = {
          type: 'Tag',
          name,
          color
        };

        const newTag = await this.actions.create({ ...ctx, params: tagData });
        console.log('Nouveau tag créé:', newTag);
        return newTag;

      } catch (error) {
        console.error('Erreur lors de la création du tag:', error);
        throw error;
      }
    }
  }
}; 