[![SemApps](https://badgen.net/badge/Powered%20by/SemApps/28CDFB)](https://semapps.org)

# Mastopod

A Mastodon-compatible app that saves all data on your Pod.

Built on the [ActivityPods](https://activitypods.org) framework.

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js and Yarn
- Make

### Development Setup

1. **Start the Core Services**
   ```bash
   make start
   ```
   This command starts the following services via Docker:
   - Fuseki (Database)
   - Redis (Cache)
   - Mailcatcher (Email testing)
   - Arena (Queue management)
   - ActivityPods backend and frontend servers

2. **Start the Development Servers**
   
   Open two terminal windows and run:

   ```bash
   # Terminal 1: Start the frontend development server
   cd frontend
   yarn run dev

   # Terminal 2: Start the backend development server
   cd backend
   yarn run dev
   ```

   The application should now be accessible at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3004
   - Mailcatcher UI: http://localhost:1080
   - Arena UI: http://localhost:4567

### Stopping the Project

To stop all services:
```bash
make stop
```

## Commands

### For development

`make start` Starts the activitypods provider using a docker-compose file. This includes the activitypods backend and frontend server, the fuseki db, mailcatcher, redis, and arena.

`make stop` Stops and removes all containers for the activitypods provider.

`make config` Prints the config with the `.env`-file-provided environment variables filled.

`make logs-activitypods` Prints the activitypods provider logs.

`make attach-activitypods` Attaches to the [moleculer](https://moleculer.services/) repl of the activitypods backend.

### For production

`make build-prod` Builds the activitypods provider images for production. In addition to the dev images, this includes a traefik reverse proxy.

`make start-prod` Starts the activitypods provider containers for production.

`make stop-prod` Stops and removes running activitypods provider containers.

`make config-prod` Prints the config with the `.env`-file-provided environment variables filled.

`make attach-backend-prod` Attaches to the [moleculer](https://moleculer.services/) repl of the activitypods backend.

## Funding

This project is funded through the [NGI0 Entrust Fund](https://nlnet.nl/entrust), a fund
established by [NLnet](https://nlnet.nl) with financial support from the European Commission's
[Next Generation Internet](https://ngi.eu) program, under the aegis of DG Communications Networks,
Content and Technology under grant agreement No 101069594. Learn more on the [NLnet project page](https://nlnet.nl/project/ActivityPods).

[<img src="https://nlnet.nl/logo/banner.png" alt="NLNet foundation logo" width="300" />](https://nlnet.nl/)
[<img src="https://nlnet.nl/image/logos/NGI0Entrust_tag.svg" alt="NGI Zero Entrust Logo" width="300" />](https://nlnet.nl/entrust)

## Features

### Core Features
- Mastodon-compatible interface
- Data sovereignty through personal Pods
- ActivityPub protocol support

### Expiration Features
The app includes time-based note expiration with the following capabilities:

1. **Time-Limited Notes**
   - Optional expiration date for notes
   - Automatic note deletion after expiration
   - Configurable duration

2. **Technical Implementation**
   ```json
   {
     "@context": "https://www.w3.org/ns/activitystreams",
     "type": "Note",
     "content": "This is a temporary note",
     "endTime": "2024-03-20T15:30:00Z"
   }
   ```

3. **Key Benefits**
   - Standard ActivityStreams 2.0 property (endTime)
   - Native temporal content management
   - High interoperability with ActivityPub ecosystem
   - Automatic cleanup of expired content

### Geolocation Features
The app includes geolocation-based note sharing with the following capabilities:

1. **Location-Based Notes**
   - Automatic location detection from user profile (vcard:hasGeo)
   - Configurable visibility radius (default: 10km)
   - Location-based visibility filtering

2. **Technical Implementation**
   ```json
   {
     "@context": [
       "https://www.w3.org/ns/activitystreams",
       {
         "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
         "radius": {
           "@id": "as:radius",
           "@type": "xsd:float"
         }
       }
     ],
     "type": "Note",
     "location": {
       "type": "Place",
       "name": "Author's location",
       "latitude": 48.8566,
       "longitude": 2.3522
     },
     "radius": 10.0,
     "audience": {
       "type": "Place",
       "name": "Broadcast zone",
       "radius": 10.0,
       "units": "km"
     }
   }
   ```

3. **Key Benefits**
   - Standard ActivityStreams 2.0 compatibility
   - Minimal vocabulary extension
   - High interoperability with ActivityPub ecosystem
   - Clear geographical boundaries for content

## Technical Considerations

### Geolocation Implementation
- Automatic location detection from user profile
- Distance calculation optimization
- Location data privacy protection
- Performance considerations for geographical queries

### Expiration Implementation
- Automatic detection and handling of expired notes
- Server-side cleanup process
- Timezone handling
- Clear visual indicators for expiring content

### Limitations
- GPS coordinate precision
- Position update frequency
- Server load for geographical calculations
- Network latency impact
- Timezone synchronization for expiration
- Cleanup process reliability
