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
        1: 'Keep full control of your data with your personal Pod',
        2: 'Connect to the Fediverse (Mastodon)'
      },
      coming_soon_title: 'Coming soon:',
      coming_soon: {
        0: 'Create privacy circles for private sharing',
        1: 'Communicate with local interest groups',
        2: 'Control the reach of your messages'
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
      skip_button: 'Skip for Now'
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
      feed: 'Feed',
      followers: 'Followers',
      following: 'Following',
      posts: 'Posts',
      posts_and_replies: 'Posts & Replies',
      about: 'About'
    },
    card: {
      find_user: 'Find user'
    },
    placeholder: {
      message: 'Type a message'
    },
    block: {},
    input: {
      message: 'Your message',
      reply: 'Your reply'
    },
    helper: {
      find_user: 'To find another fediverse member, enter their handle and hit enter.'
    },
    message: {
      early_dev_warning:
        'This application is in early development. Use it for tests only, and please report issues you find on'
    },
    notification: {
      activity_send_error: 'Error while posting the activity: %{error}',
      message_sent: 'Your message has been sent',
      post_boosted: 'The post has been boosted',
      post_liked: 'The post has been starred',
      post_like_removed: 'The post has been unstarred',
      actor_followed: 'You are now following this actor',
      actor_unfollowed: 'You are not following this actor anymore',
      image_upload_error: 'Uploading picture failed'
    },
    validation: {},
    tag: {
      create: 'Create a new tag',
      label: 'Tag name',
      add: 'Add a tag',
      cancel: 'Cancel'
    },
    backed_by_organization: 'Backed by %{organizationName}'
  },
  auth: {
    action: {
      signup: 'Sign up'
    }
  },
  ra: {
    auth: {
      sign_in: 'Sign in'
    }
  }
};
