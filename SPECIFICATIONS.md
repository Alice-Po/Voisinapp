# VoisinApp Specifications

## 1. Project Overview

VoisinApp is a local social network application that allows residents of an area to communicate easily with each other. It aims to solve the main limitations of current instant messaging groups:

* Lack of geographic management: No need to join multiple groups based on location. Someone living at the border of several municipalities automatically receives information relevant to their area.
* Personalized group management: Everyone can create and manage their own groups without depending on centralized administration. For example, I can manage my mushroom picking group independently.
* Information organization: A tag system replaces the multiplication of thematic groups. Instead of having a "donations" group and an "events" group, information is classified by tags, making searching easier and avoiding scattered information.
* Reduction of duplicates: The application prevents the same information from being received multiple times by members of different groups, thus limiting information overload.

The application is based on [ActivityPods](https://activitypods.org/), which itself is based on the [ActivityPub](https://activitypub.rocks/) protocol and uses the [Solid](https://www.solidproject.org/) framework to store data in decentralized PODs (Personal Online Data).

## 2. Core Features

### 2.1 Note System
- Creation and sharing of notes with configurable visibility
- Image attachment support
- Note expiration system
- Tag-based organization
- Threaded responses and interactions

### 2.2 Geographic Management
- Automatic geographic scope based on user location
- Configurable sharing radius for each note
- Multiple reference addresses support
- Dynamic content filtering based on location
- Modification of geographic parameters after publication

### 2.3 Search and Discovery
- Multi-criteria search functionality:
  * Geographic scope
  * Tags
  * Keywords
  * Visibility settings
- Tag-based filtering
- Location-based content discovery
- Advanced filter combinations

### 2.4 Contact Management
- Contact request system
- Privacy settings per contact
- Contact information access control
- Group creation and management
- Contact categorization

### 2.5 User Profile
- Initial profile setup:
  * Username
  * Description
  * Profile picture
  * Address(es)
  * Contact information
- Privacy settings management
- Data control through personal POD

### 2.6 Notification System
- Contact request notifications
- Response notifications
- Geographic-based alerts
- Customizable notification preferences

## 3. Technical Architecture

### 3.1 Decentralized Infrastructure
- ActivityPods framework integration
- Personal data storage in Solid PODs
- ActivityPub protocol for communication
- Semantic web standards (RDF)

### 3.2 Frontend
- React-based user interface
- Geographic visualization components
- Real-time updates
- Mobile-responsive design
- Offline capabilities

### 3.3 Data Management
- Decentralized data storage in PODs
- Geographic data indexing
- Tag-based organization
- Privacy-preserving search
- Data portability

## 4. Privacy and Security

- User data stored in personal PODs
- Granular privacy controls
- Geographic data protection
- Encrypted communications
- User-controlled data sharing

## 5. Development Guidelines

### 5.1 Code Organization
- Feature-based architecture
- Comprehensive test coverage
- Clear documentation
- Semantic versioning

### 5.2 Testing Requirements
- End-to-end testing with Cucumber
- Component testing
- Geographic feature testing
- Privacy feature validation

## 6. Future Considerations

- Federation with other ActivityPub services
- Enhanced geographic features
- Additional group management tools
- Advanced tagging system improvements
- Mobile application development
