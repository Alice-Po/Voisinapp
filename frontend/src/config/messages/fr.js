// Model https://github.com/marmelab/react-admin/blob/master/packages/ra-language-french/src/index.ts

export default {
  app: {
    welcome: 'Bienvenue sur VoisinApp !',
    tagline:
      "VoisinApp est une application de communication de voisinage afin de favoriser le lien, le partage et la solidarité entre habitants d'un même coin.",
    features: {
      title: "Aujourd'hui :",
      current: {
        0: 'Écrivez des messages public à portée géographique avec vos voisins',
        1: "Taggez vos messages pour les organiser et choissisez ou pas une date d'expiration",
        2: 'Booster, aimer ou répondez aux messages de vos voisins'
      },
      coming_soon_title: 'Bientôt :',
      coming_soon: {
        0: "Créez des cercles d'intimité pour des partages privés",
        1: "Communiquez avec des groupes d'intérêt locaux",
        2: 'Contrôlez la portée de diffusion de vos messages : restreinte ou virale'
      }
    },
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
      learn_more: 'Un billet de blog pour en savoir plus sur le projet',
      contact: 'Nous contacter',
      continue: "J'ai compris, continuer vers VoisinApp"
    },
    location_dialog: {
      title: 'Définir votre localisation',
      subtitle: 'Choisissez votre quartier',
      description:
        'Pour profiter au mieux de VoisinApp, veuillez définir votre localisation dans les paramètres de votre profil sur votre hébergeur de données. Cela vous permettra de vous connecter avec vos voisins et de voir le contenu local pertinent.',
      privacy_note:
        "Seule votre ville/commune sera visible pour les autres utilisateurs. Votre adresse exacte restera privée et vous n'êtes d'ailleurs pas obligé de la donner..",
      set_location_button: 'Définir la localisation dans les paramètres de votre hebergeur de données',
      skip_button: 'Passer pour le moment'
    },
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
        'Cette application est en cours de développement. Utilisez-la pour des tests uniquement, et veuillez remonter les bugs que vous trouvez sur'
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
    },
    backed_by_organization: 'Soutenu par %{organizationName}',
    loading: {
      title: 'Refaire le web prends du temps..',
      feed_loading: "Votre fil d'actualité est en cours de chargement.",
      explanation:
        "Si le chargement prend un peu de temps, c'est parce que nous avons fait des choix technologique qui respectent réellement les humains et leur autonomie. Les temps de chargement sont en cours d'amélioration.",
      activitypods_intro: "VoisinApp s'appuie sur",
      activitypods_description:
        ', une technologie aux ambitions révolutionnaires qui vous redonne le contrôle de vos données et de vos interactions numériques.'
    }
  },
  auth: {
    action: {
      signup: "S'inscrire"
    }
  },
  ra: {
    auth: {
      sign_in: 'Se connecter'
    }
  }
};
