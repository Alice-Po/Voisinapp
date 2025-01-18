// Model https://github.com/marmelab/react-admin/blob/master/packages/ra-language-french/src/index.ts

export default {
  app: {
    description: 'Une appli compatible Mastodon qui enregistre tout dans votre Pod',
    action: {
      edit_profile: 'Editer le profile',
      follow: 'Suivre',
      unfollow: 'Ne plus suivre',
      send: 'Envoyer',
      reply: 'Répondre',
      boost: 'Booster',
      like: 'Soutenir'
    },
    page: {
      my_inbox: 'Boîte de réception',
      my_outbox: "Boîte d'envoi",
      feed: 'Fil d\'actualités',
      followers: 'Abonnés',
      following: 'Abonnements',
      about: 'À propos',
      posts: 'Messages',
      posts_and_replies: 'Messages & Réponses'
    },
    card: {
      find_user: 'Trouver un acteur'
    },
    placeholder: {
      message: 'Saisir un message'
    },
    block: {},
    input: {
      message: 'Votre message',
      reply: 'Votre réponse',
      radius: 'Rayon de visibilité (km)',
      radius_help: 'Distance maximale à laquelle votre message sera visible',
      expiration_date: "Date d'expiration"
    },
    helper: {
      find_user: 'Pour trouver un acteur dans le fediverse, entrez son identifiant et tapez Enter.'
    },
    message: {
      early_dev_warning:
        'Cette application est en cours de développement. Utilisez-la pour des tests uniquement, et veuillez remonter les bugs que vous trouvez sur',
      actor_boosted: '%{actor} a boosté'
    },
    notification: {
      message_sent: 'Votre message a été envoyé',
      message_send_error: 'Erreur en envoyant le message: %{error}',
      post_boosted: 'Le message a été boosté',
      post_liked: 'Le message a été liké',
      post_like_removed: 'Le like du message a été enlevé',
      actor_followed: 'Vous suivez maintenant cet acteur',
      actor_unfollowed: 'Vous ne suivez plus cet acteur',
      image_upload_error: 'Echec de l\'upload de l\'image',
    },
    validation: {
      radius_range: 'Le rayon doit être compris entre 0 et 50 kilomètres'
    }
  }
};
