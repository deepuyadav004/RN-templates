# Competitive Programming Tracker

A comprehensive React Native mobile application built with Expo that allows competitive programmers to track their progress across multiple coding platforms including Codeforces, LeetCode, and CodeChef.

## 📱 Features

### 🏠 Home Dashboard
- **Platform Cards**: Visual overview of your performance across all platforms
- **User Management**: Easy setup and editing of usernames for each platform
- **Real-time Data**: Fetches latest ratings and statistics from APIs
- **Beautiful UI**: Modern design with platform-specific theming

### 👤 Profile Analytics
- **Multi-Platform Support**: Track progress on Codeforces, LeetCode, and CodeChef
- **Interactive Charts**: 
  - Codeforces rating progression over time
  - Problem difficulty distribution
  - Problem tags analysis
  - LeetCode contest performance
  - LeetCode skill statistics with progress rings
  - CodeChef activity heatmap
- **Animated Sections**: Smooth transitions between platform views
- **Data Persistence**: Cached data for offline viewing

### 🏆 Contest Tracker
- **Upcoming Contests**: Real-time contest listings from all platforms
- **Smart Notifications**: Automated alerts for upcoming contests
- **Multi-Platform Integration**: Unified view of contests across platforms
- **Contest Details**: Start time, duration, and platform information
- **Refresh Capability**: Pull-to-refresh for latest contest data

## 🛠️ Tech Stack

### Frontend Framework
- **React Native** (0.74.5) - Cross-platform mobile development
- **Expo** (~51.0.28) - Development platform and build tools
- **TypeScript** - Type-safe development

### Navigation & Routing
- **Expo Router** (~3.5.23) - File-based routing system
- **React Navigation** (^6.0.2) - Navigation library

### UI & Styling
- **React Native Reanimated** (~3.10.1) - Advanced animations
- **React Native Gesture Handler** (~2.16.1) - Touch interactions
- **Expo Vector Icons** (^14.0.2) - Icon library
- **Custom Fonts**: Gudea and Overpass font families

### Data Visualization
- **React Native Chart Kit** (^6.12.0) - Charts and graphs
- **React Native SVG** (15.2.0) - Custom SVG graphics

### Data Management
- **AsyncStorage** (1.23.1) - Local data persistence
- **Expo Notifications** (~0.28.19) - Push notifications

### Development Tools
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Babel** - JavaScript compilation

## 🏗️ Project Structure

```
📁 app/
  ├── 📁 (app)/
  │   ├── 📁 (Home)/          # Home dashboard
  │   ├── 📁 (Profile)/       # User profile and analytics
  │   └── 📁 (Contests)/      # Contest tracking
  └── _layout.tsx             # Root layout
📁 api/
  ├── 📁 codeforcesApis/      # Codeforces API integration
  ├── 📁 leetcodeApis/        # LeetCode API integration
  └── 📁 codechefApis/        # CodeChef API integration
📁 components/
  ├── 📁 charts/              # Data visualization components
  ├── 📁 cards/               # Platform cards
  ├── 📁 forms/               # User input forms
  └── 📁 modals/              # Modal dialogs
📁 hooks/                     # Custom React hooks
📁 types/                     # TypeScript interfaces
📁 constants/                 # App constants and colors
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd navigation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on specific platform**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 📊 API Integrations

### Codeforces API
- **Endpoint**: `https://codeforces.com/api/user.info`
- **Data**: User ratings, rankings, contest history
- **Features**: Real-time rating tracking, problem statistics

### LeetCode API
- **Custom endpoints** for user statistics
- **Data**: Contest ratings, problem solving progress
- **Features**: Skill analysis, contest performance

### CodeChef API
- **User information** and contest data
- **Data**: Ratings, rankings, activity patterns
- **Features**: Activity heatmaps, performance tracking

## 🎨 Design Features

### Theme System
- **Dynamic Color Scheme**: Automatic light/dark mode detection
- **Platform Branding**: Each platform has distinct visual identity
- **Consistent Typography**: Custom font integration

### Animations
- **Smooth Transitions**: React Native Reanimated for fluid UX
- **Loading States**: Elegant loading indicators
- **Gesture Handling**: Responsive touch interactions

### Charts & Visualizations
- **Rating Progression**: Line charts showing rating changes over time
- **Problem Distribution**: Pie charts for difficulty analysis
- **Activity Heatmaps**: Calendar-style activity visualization
- **Progress Rings**: Circular progress indicators for skills

## 📱 Platform Support

- **iOS**: Native iOS app with platform-specific features
- **Android**: Native Android app with material design
- **Web**: Progressive web app capability

## 🔧 Configuration

### App Configuration (`app.json`)
- App name, version, and metadata
- Platform-specific settings
- Notification permissions
- Splash screen and icon configuration

### Environment Setup
- Expo environment configuration
- TypeScript configuration
- ESLint and Jest setup

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint
```

## 📦 Building for Production

### EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for all platforms
eas build --platform all
```

### Local Build
```bash
# iOS
expo build:ios

# Android
expo build:android
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Codeforces for providing free API access
- LeetCode for contest and user data
- CodeChef for platform integration
- Expo team for excellent development tools
- React Native community for components and libraries

## 🐛 Known Issues

- Contest notifications may require manual permission setup on some devices
- API rate limiting may affect frequent data refreshes
- Some chart animations may be slower on older devices

## 🚧 Future Enhancements

- [ ] Additional platform support (AtCoder, HackerRank)
- [ ] Advanced analytics and insights
- [ ] Social features and friend comparisons
- [ ] Offline mode improvements
- [ ] Desktop/tablet optimizations

---

**Made with ❤️ for the competitive programming community**
