// Model https://github.com/marmelab/react-admin/blob/master/packages/ra-language-french/src/index.ts

export default {
  app: {
    welcome: 'Welcome to VoisinApp!',
    tagline:
      'VoisinApp is a neighborhood communication app that promotes connection, sharing, and solidarity between residents of the same area.',
    features: {
      title: 'Today:',
      current: {
        0: 'Share geolocated messages with your neighbors',
        1: 'Tag your messages to organize them and optionally set an expiration date',
        2: "Boost, like, or reply to your neighbors' messages"
      },
      coming_soon_title: 'Coming soon:',
      coming_soon: {
        0: 'Create privacy circles for private sharing',
        1: 'Communicate with local interest groups',
        2: 'Control the reach of your messages: restricted or viral'
      }
    },
    welcome_dialog: {
      title: 'Welcome to VoisinApp - Proof of Concept',
      intro:
        'VoisinApp is a technical demonstration based on 4 years of studying neighborhood networks on Signal, WhatsApp, and Telegram. Our goal is to combine the best practices observed while overcoming identified limitations.',
      about_title: 'About this Demo',
      about_intro: 'This proof of concept will remain online until February 21, 2026. It aims to:',
      about_points: {
        0: 'Demonstrate technical feasibility',
        1: 'Gather user feedback',
        2: 'Explore paths to a viable business model'
      },
      contribute_title: 'Contribute to the Project',
      report_issue: 'Report a bug or suggest an improvement',
      learn_more: 'Learn more about the project',
      contact: 'Contact us',
      continue: 'I understand, continue to VoisinApp'
    },
    location_dialog: {
      title: 'Set Your Location',
      subtitle: 'Choose Your Neighborhood',
      description:
        'To get the most out of VoisinApp, please set your location in your pod provider settings. This will help you connect with neighbors and see relevant local content.',
      privacy_note: 'Only your city/town will be visible to other users. Your exact address will remain private.',
      set_location_button: 'Set Location in Pod Settings',
      skip_button: 'Skip for Now',
      location_set: 'I just did it!'
    },
    description:
      'VoisinApp reinvents neighborhood communication by combining the best of social networks with privacy respect.\n\n' +
      'Today:\n' +
      '• Share geolocated messages with your neighbors\n' +
      '• Keep full control of your data with your personal Pod\n' +
      '• Connect to the Fediverse (Mastodon)\n\n' +
      'Coming soon:\n' +
      '• Create privacy circles for private sharing\n' +
      '• Communicate with local interest groups\n' +
      '• Control the reach of your messages',
    action: {
      edit_profile: 'Edit profile',
      follow: 'Follow',
      unfollow: 'Unfollow',
      send: 'Send',
      reply: 'Reply',
      boost: 'Boost',
      like: 'Like'
    },
    page: {
      my_inbox: 'Inbox',
      my_outbox: 'Outbox',
      local_feed: 'Local Feed',
      public_feed: 'Public Feed',
      followers: 'Followers',
      following: 'Following',
      about: 'About',
      posts: 'Posts',
      posts_and_replies: 'Posts & Replies'
    },
    card: {
      find_user: 'Find user'
    },
    placeholder: {
      message: 'Share something with your neighbors...'
    },
    block: {},
    input: {
      message: 'Your message',
      reply: 'Your reply',
      radius: 'Visibility radius (km)',
      radius_help: 'Maximum distance at which your message will be visible',
      expiration_date: 'Expiration date',
      radius_scope: '📍 Visible within %{radius} km around you'
    },
    helper: {
      find_user: 'To find another fediverse member, enter their handle and hit enter.'
    },
    message: {
      early_dev_warning:
        'This application is in early development. Use it for tests only, and please report issues you find on',
      geographic_info: '📍 Messages shown are from your geographic area',
      public_info: '🌍 Messages shown are from the entire whole',
      no_location_set: '📍 Set your location to see messages from your area',
      no_messages_in_radius: 'No messages in your geographic area at the moment',
      importing_posts: 'Importing historical posts... %{progress}%'
    },
    notification: {
      message_sent: 'Your message has been sent',
      message_send_error: 'Error while sending the message: %{error}',
      activity_send_error: 'Error while posting the activity: %{error}',
      post_boosted: 'The post has been boosted',
      post_liked: 'The post has been liked',
      post_like_removed: 'The post like has been removed',
      actor_followed: 'You are now following this actor',
      actor_unfollowed: 'You are not following this actor anymore',
      image_upload_error: 'Failed to upload image',
      historical_posts_fetched: 'Historical posts have been retrieved successfully',
      historical_posts_error: 'Error while retrieving historical posts',
      historical_posts_imported: 'Historical posts have been imported successfully',
      historical_posts_import_error: 'Error while importing historical posts'
    },
    validation: {
      radius_range: 'Radius must be between 0 and 50 kilometers'
    },
    visibility: {
      public: 'Public',
      followersOnly: 'Followers only',
      mentionsOnly: 'Mentions only'
    },
    tag: {
      create: 'Create a new tag',
      label: 'Tag name',
      add: 'Add a tag',
      cancel: 'Cancel'
    },
    backed_by_organization: 'Backed by %{organizationName}',
    loading: {
      title: 'Rebuilding the web takes time..',
      feed_loading: 'Your news feed is loading.',
      explanation: "If loading takes a while, it's because we use great technologies."
    }
  },
  auth: {
    action: {
      signup: 'Sign up'
    }
  },
  ra: {
    auth: {
      sign_in: 'Sign in'
    },
    action: {
      search: 'Search'
    }
  }
};
