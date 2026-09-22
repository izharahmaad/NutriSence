NutriSense 🍎
Your Personalized Health & Nutrition Companion
NutriSense is an AI-powered mobile application designed to help users make informed decisions about food, fitness, hydration, and daily wellbeing. It combines personalized nutrition guidance, AI-assisted food analysis, culturally aware meal recommendations, health tracking, reminders, and offline support in one mobile experience.

🚧 NutriSense is a final-year academic project under active development. It is intended for educational and wellness-support purposes and is not a substitute for professional medical advice.







Contents
Overview

Why NutriSense

Features

User Journey

Technology Stack

Application Modules

Architecture

Project Structure

Getting Started

Environment Configuration

Development Commands

Data and Privacy

Testing

Roadmap

Limitations

Academic Context

Contributing

License

Contact

Overview
NutriSense helps users build healthier daily habits through practical, personalized, and accessible tools. Instead of treating nutrition as a one-size-fits-all problem, the application considers personal goals, dietary preferences, regional food habits, cultural context, religious requirements, activity, and available connectivity.

The application is designed around four principles:

Personalization: recommendations should reflect the user's goals and preferences.

Cultural awareness: meal suggestions should support regional, cultural, and religious dietary needs.

Practical wellness: users should be able to track realistic daily habits such as food, water, sleep, and exercise.

Accessibility: important information should remain available when connectivity is limited.

Why NutriSense
Many nutrition applications provide generic calorie information without considering local food choices, cultural context, or intermittent internet access. NutriSense aims to provide a more relevant experience by combining AI-assisted food analysis with personal preferences, local storage, and a modular mobile architecture.

Features
Personalized onboarding
Collect user profile information and wellness goals.

Support goals such as weight management, healthy eating, fitness improvement, and habit building.

Store dietary preferences and restrictions for more relevant recommendations.

AI-assisted food analysis
Analyze food images through the LogMeal API.

Search food information using text through CalorieNinjas as a fallback.

Present estimated nutritional information in a user-friendly format.

Provide a foundation for improving food recognition and nutrition estimation over time.

Food recognition and nutrition values are estimates. Users should verify important dietary information, especially when allergies or medical conditions are involved.

Culturally aware meal planning
Recommend meals according to personal preferences.

Support regional food choices and culturally familiar meals.

Consider religious requirements such as halal preferences.

Provide a foundation for customized calorie and nutrient targets.

Health and habit tracking
Track meals and estimated calorie intake.

Record water and hydration progress.

Monitor sleep and daily activity.

Support step count, heart rate, and workout information where data is available.

Present progress through a clear dashboard.

Workout support
Display guided workout routines.

Use Lottie animations to make exercise instructions more engaging.

Organize routines by activity type, duration, or fitness goal.

Support progress tracking for completed workouts.

Reminders and notifications
Hydration reminders.

Meal and nutrition reminders.

Sleep schedule reminders.

Workout notifications.

Configurable notification preferences and schedules.

Offline-first support
Cache selected content locally with AsyncStorage.

Make key information available during temporary connectivity loss.

Store pending user actions for future synchronization.

Provide a foundation for conflict-aware data synchronization.

Wearable integration foundation
Prepare for synchronization with health and fitness devices.

Support a future connection with platforms such as Fitbit or Mi Band.

Provide a modular structure for importing steps, heart rate, sleep, and workout data.

User Journey
The user creates an account and completes the onboarding process.

NutriSense collects goals, dietary preferences, region, and relevant restrictions.

The user scans food or searches for a meal manually.

The application estimates nutritional information and records the result.

The user receives meal, hydration, and workout suggestions.

Daily activity is displayed on the progress dashboard.

The application continues to provide selected information when the device is offline.

Technology Stack
Layer	Technologies
Mobile application	React Native, Expo, TypeScript
Navigation and UI	React Navigation, reusable React Native components
Animations	Lottie
Authentication	Firebase Authentication
Cloud database	Cloud Firestore
Local persistence	AsyncStorage, local JSON data
Food and nutrition APIs	LogMeal, CalorieNinjas, Spoonacular
Development tools	Visual Studio Code, Expo Go, Android Emulator
Testing and debugging	Expo development tools, Firebase Console, browser debugging tools
Application Modules
Authentication and onboarding: account creation, sign-in, profile setup, and preferences.

Nutrition: food search, food scanning, nutrition results, meal history, and meal planning.

Health dashboard: calories, hydration, sleep, activity, and progress summaries.

Workout: routines, exercise animations, completion tracking, and goals.

Notifications: reminder creation, scheduling, and preference management.

Offline storage: local cache, offline data access, and synchronization preparation.

Profile and settings: user preferences, privacy controls, dietary requirements, and account management.

Expert support foundation: planned communication and professional guidance features.

Architecture
NutriSense follows a modular client-cloud architecture:

text
┌─────────────────────────────────────────────┐
│              NutriSense Mobile App          │
│       React Native + Expo + TypeScript      │
├─────────────────────────────────────────────┤
│ UI Screens • Navigation • State • Validation│
│ Nutrition • Health • Workout • Notifications│
└──────────────────────┬──────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
┌─────────▼─────────┐     ┌─────────▼─────────┐
│ Firebase Services │     │ External Services │
│ Auth + Firestore  │     │ Food and AI APIs  │
└─────────┬─────────┘     └─────────┬─────────┘
          │                         │
          └────────────┬────────────┘
                       │
              ┌────────▼────────┐
              │ Local Data Layer│
              │ AsyncStorage    │
              │ Offline JSON    │
              └─────────────────┘
The mobile application communicates with Firebase for authentication and cloud data, calls external nutrition services for food analysis, and uses local storage to support offline access and a smoother user experience.

Project Structure
The exact folders may change as development continues. A typical structure is:

text
NutriSence/
├── assets/                 # Images, icons, fonts, and animations
├── components/             # Reusable UI components
├── constants/              # Theme, colors, configuration, and static values
├── data/                   # Local JSON and offline content
├── hooks/                  # Reusable React hooks
├── navigation/             # Navigation configuration
├── screens/                # Application screens
├── services/               # Firebase, API, notification, and storage services
├── types/                  # Shared TypeScript types and interfaces
├── utils/                  # Validation, formatting, and helper functions
├── app.json                # Expo configuration
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
Getting Started
Prerequisites
Install the following before running the project:

Node.js LTS.

npm or another compatible package manager.

Expo CLI or the Expo development workflow.

Expo Go on a compatible mobile device, or an Android emulator/iOS simulator.

A Firebase project for authentication and Firestore features.

API credentials for the external services used by your local configuration.

Installation
Clone the repository:

bash
git clone https://github.com/izharahmaad/NutriSence.git
cd NutriSence
Install dependencies:

bash
npm install
Start the Expo development server:

bash
npx expo start
Then choose one of the available options:

Scan the QR code with Expo Go.

Press a to open an Android emulator.

Press i to open an iOS simulator on macOS.

Press w to open the web development build if web support is configured.

Environment Configuration
Do not commit API keys, private credentials, service-account files, or secrets to GitHub. Create a local environment file according to the configuration used by the project. For example:

text
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
EXPO_PUBLIC_LOGMEAL_API_KEY=your_logmeal_api_key
EXPO_PUBLIC_CALORIENINJAS_API_KEY=your_calorieninjas_api_key
EXPO_PUBLIC_SPOONACULAR_API_KEY=your_spoonacular_api_key
Use only the variables that the application actually reads. Add environment files to .gitignore:

text
.env
.env.*
!.env.example
If you use Expo public variables, remember that values exposed to a mobile application should not be treated as server-side secrets. Sensitive operations should be moved to a secure backend or protected server function.

Development Commands
bash
# Start the development server
npx expo start

# Start with a cleared Metro cache
npx expo start -c

# Check the project for common issues
npx expo-doctor

# Run the TypeScript compiler without emitting files
npx tsc --noEmit
The available commands depend on the scripts defined in package.json. Check that file before adding commands that are not configured in the project.

Data and Privacy
NutriSense may process profile information, dietary preferences, nutrition records, activity information, and data returned by connected services. The production application should:

Collect only information required for the selected feature.

Explain how user data is stored and used.

Protect Firestore data with appropriate security rules.

Avoid storing API keys in the mobile client when a secret backend is required.

Provide users with account and data-management options.

Treat health-related information as sensitive.

Avoid presenting estimated nutrition data as medical advice.

Testing
The project can be tested using the following workflow:

Run the application with Expo Go or an emulator.

Test onboarding, authentication, and profile updates.

Test food scanning and text-based food search.

Test API failure and fallback behavior.

Test empty, invalid, and slow network responses.

Test offline access and reconnection behavior.

Test notification permissions and reminder scheduling.

Test Firestore reads, writes, and security rules.

Test different screen sizes and accessibility settings.

Run TypeScript checks and review console warnings before committing.

Roadmap
Nutrition intelligence
Improve food recognition for regional and homemade meals.

Add portion-size estimation and confidence indicators.

Support barcode scanning and packaged-food labels.

Provide nutrient-level insights for protein, carbohydrates, fats, fiber, sugar, sodium, vitamins, and minerals.

Add ingredient and allergen detection.

Improve meal recommendations using user history and feedback.

Personalization
Add configurable calorie and nutrient targets.

Support goals such as weight management, muscle gain, general wellness, and condition-aware meal planning with professional guidance.

Add meal replacement and ingredient-substitution suggestions.

Support household profiles and family meal planning.

Add regional food databases for Pakistani and South Asian meals.

Improve halal, vegetarian, vegan, allergy, and intolerance filters.

Health tracking
Add weekly and monthly progress reports.

Add charts for calories, hydration, sleep, activity, and workout consistency.

Add habit streaks with flexible recovery rules.

Support manual health-data entry with validation.

Add Health Connect and Apple Health integration where supported.

Improve Fitbit and Mi Band synchronization through a secure integration layer.

Offline-first experience
Add a reliable local database for larger offline datasets.

Queue offline actions for synchronization when connectivity returns.

Add conflict resolution for edits made on multiple devices.

Show synchronization status and last-updated timestamps.

Cache personalized plans and recently viewed nutrition information.

AI and safety
Add explainable recommendations that show why a meal was suggested.

Add confidence scores and an option to correct recognition results.

Add safe-response rules for medical and allergy-related questions.

Add referral guidance for dietitians, doctors, and other qualified professionals.

Evaluate recommendation quality using anonymized, consent-based feedback.

Add monitoring for API errors, unsafe outputs, and inaccurate nutrition estimates.

User experience
Add an accessible theme and dark mode.

Add multilingual support, including Urdu and English.

Add voice-assisted food logging and reminders.

Add clearer onboarding and a guided first-day experience.

Add customizable dashboard cards and widgets.

Add larger text support and improved screen-reader labels.

Community and professional support
Add verified dietitian and fitness-professional profiles.

Add appointment or consultation requests.

Add moderated educational content.

Add recipe sharing with nutritional information.

Add community challenges with privacy-conscious leaderboards.

Add a moderated expert-chat feature with clear medical disclaimers.

Engineering and quality
Add unit, integration, and end-to-end test coverage.

Add continuous integration with GitHub Actions.

Add automated linting and type checking for pull requests.

Add crash reporting and performance monitoring.

Add secure backend functions for protected API calls.

Add release builds, version management, and deployment documentation.

Add privacy, accessibility, and security reviews before production release.

Limitations
Nutrition results from external APIs may be estimates and may not cover every regional dish.

Food recognition can be affected by image quality, lighting, ingredients, and portion visibility.

Wearable support depends on device availability, platform permissions, and API access.

Offline functionality may not include every feature.

Health-related recommendations should be reviewed by a qualified professional when users have medical conditions, allergies, or special dietary needs.

Academic Context
NutriSense was developed as a Bachelor of Computer Science final-year academic project at Abdul Wali Khan University Mardan.

Developer: Izhar Ahmad

Degree: Bachelor of Computer Science

Study period: 2021–2025

Supervisor: Mr. Arjumand Yar Khan

Contributing
Contributions, suggestions, and issue reports are welcome while the project is under development.

Fork the repository.

Create a feature branch:

bash
git checkout -b feature/your-feature-name
Make focused changes and test them locally.

Commit your work:

bash
git commit -m "Add a clear description of the change"
Push the branch:

bash
git push origin feature/your-feature-name
Open a pull request with a clear title, description, screenshots where useful, and testing notes.

Please do not include secrets, private credentials, or unrelated changes in a pull request.

License
License details should be added before public distribution. If this project is intended to remain proprietary, replace this section with the appropriate copyright and usage notice. If you choose an open-source license, add the matching LICENSE file to the repository.

Contact
Developer: Izhar Ahmad

GitHub: @izharahmaad

Project: NutriSence

Made with React Native, Expo, TypeScript, Firebase, and a focus on accessible, culturally aware digital wellness. 🍎
