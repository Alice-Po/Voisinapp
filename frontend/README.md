# Frontend

This is the frontend application for Mastopod, built with React and Vite.

## Development

### Prerequisites
- Node.js
- Yarn

### Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn run dev
```

The application will be available at http://localhost:4004.

## Testing

### Running Tests

The project uses Cucumber.js for end-to-end testing. Tests are located in the `features` directory.

```bash
# Run all tests
yarn test-features

# Run specific tests using tags
yarn test-features --tags "@tag_name"
```

### Common Test Tags
- `@post_note_with_photo`: Tests posting a note with a photo

### Test Files Structure
- `features/*.feature`: Feature files containing test scenarios
- `features/step_definitions/*.js`: Step definitions implementing the test scenarios

### Known Issues

#### Puppeteer and GNOME Integration

When running tests, you might encounter issues with Puppeteer on GNOME systems. There are two possible solutions:

1. **Recommended**: Modify GNOME settings
   ```bash
   sudo nano org.gnome.settings-daemon.plugins.xsettings.gschema.xml
   ```
   This solution was found in [espanso/espanso#1122](https://github.com/espanso/espanso/issues/1122)

2. **Alternative**: Configure Puppeteer to run without GPU
   ```javascript
   const browser = await puppeteer.launch({
     headless: true,
     args: [
       '--no-sandbox',
       '--disable-setuid-sandbox',
       '--disable-dev-shm-usage',
       '--disable-gpu',
       '--disable-software-rasterizer',
     ],
   });
   ```
   Note: This solution disables browser GUI testing.

## Development Guidelines

- Avoid using arrow functions with React hooks
- Follow the project's ESLint and Prettier configurations

## Routes

The application uses the following main routes:

- `/` - Home page (redirects to `/home`)
- `/home` - Unified feed showing all messages in chronological order
- `/activity/:id` - Individual activity view
- `/actor/:username` - User profile view
- `/followers` - List of followers
- `/following` - List of following users

## Components

### Main Components

- `UnifiedFeed` - Main feed component that displays all messages in chronological order
- `ActivityBlock` - Displays individual activities/messages
- `PostBlock` - Form for creating new messages
- `Note` - Message display component with chat-like styling

### Features

- Real-time message updates
- Message expiration dates
- Geographic radius for message visibility
- Image attachments
- Message reactions (like, boost)
- Reply functionality