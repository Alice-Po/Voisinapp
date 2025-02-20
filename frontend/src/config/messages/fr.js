// Model https://github.com/marmelab/react-admin/blob/master/packages/ra-language-french/src/index.ts

export default {
  app: {
    welcome: 'Bienvenue sur VoisinApp !',
    welcome_dialog: {
      title: 'Bienvenue sur VoisinApp - Preuve de Concept',
      intro:
        "VoisinApp est une démonstration technique issue de 4 années d'étude des réseaux de voisinage sur Signal, WhatsApp et Telegram. Notre objectif est de combiner les meilleures pratiques observées tout en surmontant les limitations identifiées.",
      about_title: 'À propos de cette démonstration',
      about_intro: "Cette preuve de concept restera en ligne jusqu'au 21 février 2026. Elle vise à :",
      about_points: {
        0: 'Démontrer la faisabilité technique du projet',
        1: 'Recueillir les retours des utilisateurs',
        2: 'Explorer des pistes pour un modèle économique viable'
      },
      contribute_title: 'Contribuer au projet',
      report_issue: 'Signaler un bug ou proposer une amélioration',
      learn_more: 'En savoir plus sur le projet',
      contact: 'Nous contacter',
      continue: "J'ai compris, continuer vers VoisinApp"
    },
    description:
      'VoisinApp réinvente la communication de voisinage en combinant le meilleur des réseaux sociaux et le respect de votre vie privée.\n\n' +
      "Aujourd'hui :\n" +
      '• Partagez des messages géolocalisés avec vos voisins\n' +
      '• Gardez le contrôle total de vos données grâce à votre Pod personnel\n' +
      '• Connectez-vous au Fediverse (Mastodon)\n\n' +
      'Bientôt :\n' +
      "• Créez des cercles d'intimité pour des partages privés\n" +
      "• Communiquez avec des groupes d'intérêt locaux\n" +
      '• Contrôlez la portée de diffusion de vos messages',
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
      feed: "Fil d'actualités",
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
      activity_send_error: "Erreur lors de l'envoi de l'activité : %{error}",
      post_boosted: 'Le message a été boosté',
      post_liked: 'Le message a été liké',
      post_like_removed: 'Le like du message a été enlevé',
      actor_followed: 'Vous suivez maintenant cet acteur',
      actor_unfollowed: 'Vous ne suivez plus cet acteur',
      image_upload_error: "Echec de l'upload de l'image"
    },
    validation: {
      radius_range: 'Le rayon doit être compris entre 0 et 50 kilomètres'
    },
    tag: {
      create: 'Créer un nouveau tag',
      label: 'Nom du tag',
      add: 'Ajouter un tag',
      cancel: 'Annuler'
    }
  }
};
