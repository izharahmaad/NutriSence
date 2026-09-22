# NutriSense 🍎

## Your Personalized Health and Nutrition Companion

NutriSense is an AI-powered mobile application that helps users make informed decisions about nutrition, fitness, hydration, and daily wellbeing. The application combines personalized nutrition guidance, AI-assisted food image analysis, culturally aware meal recommendations, health tracking, reminders, and offline support in one mobile experience.

NutriSense uses a Python-based AI/ML food-analysis service to process food images and provide estimated nutritional information, including calories, carbohydrates, protein, fats, and other relevant nutrients where supported.

> **Project status:** NutriSense is a final-year academic project under active development. It is intended for educational and wellness-support purposes and is not a substitute for professional medical advice.

[![React Native](https://img.shields.io/badge/React%20Native-Expo-20232A?logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-AI%2FML-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-2ea44f)](https://expo.dev/)
[![Status](https://img.shields.io/badge/Status-Under%20Development-orange)](https://github.com/izharahmaad/NutriSence)

## Table of Contents

- [Overview](#overview)
- [Why NutriSense](#why-nutrisense)
- [How Food Analysis Works](#how-food-analysis-works)
- [Features](#features)
- [User Journey](#user-journey)
- [Technology Stack](#technology-stack)
- [Application Modules](#application-modules)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Development Commands](#development-commands)
- [Data and Privacy](#data-and-privacy)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [Limitations](#limitations)
- [Academic Context](#academic-context)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

NutriSense is designed to support healthier daily habits through practical, personalized, and accessible digital tools. Rather than providing one-size-fits-all nutrition information, the application considers a user’s personal goals, dietary preferences, regional food habits, cultural context, religious requirements, activity, and connectivity conditions.

The application is built around four principles:

- **Personalization:** recommendations should reflect each user’s goals and preferences.
- **Cultural awareness:** meal suggestions should support regional, cultural, and religious dietary needs.
- **AI-assisted analysis:** food images can be processed through a Python-based AI/ML service to estimate food and nutrient information.
- **Accessibility:** selected information should remain available when internet connectivity is limited.

## Why NutriSense

Many nutrition applications provide generic calorie information without considering local food choices, cultural context, or intermittent internet access. NutriSense aims to provide a more relevant experience by combining AI/ML-based food image analysis, user preferences, local storage, and a modular mobile architecture.

The application provides a foundation for personalized nutrition guidance while keeping the user experience simple, practical, and accessible.

## How Food Analysis Works

NutriSense uses a mobile-to-Python workflow for food image analysis:

```text
User captures food image
          │
          ▼
React Native mobile application
          │
          ▼
Python AI/ML food-analysis service
          │
          ▼
Food recognition and nutrition estimation
          │
          ▼
Nutrition result returned to the mobile app
          │
          ▼
Calories, carbohydrates, protein, fats, and other available nutrients
```

The Python service receives a food image, applies AI/ML-based analysis, and returns an estimated result to the mobile application. The mobile app then presents the detected food and nutritional information in a user-friendly format.

Depending on the configured service and available data, the response may include:

- Detected food name.
- Estimated calories.
- Carbohydrates.
- Protein.
- Fat.
- Other available nutrition information.
- Recognition or result confidence where supported.

> Food recognition and nutrition values are estimates. Users should verify important dietary information, particularly when allergies or medical conditions are involved.

## Features

### Personalized onboarding

- Collect user profile information and wellness goals.
- Support goals such as weight management, healthy eating, fitness improvement, and habit building.
- Store dietary preferences and restrictions to support more relevant recommendations.

### AI/ML food image analysis

- Capture or select a food image from the mobile application.
- Send the image to a Python-based AI/ML analysis service.
- Identify food items from the submitted image.
- Return estimated calories, carbohydrates, protein, fats, and other available nutrients.
- Display nutrition results in a clear and accessible format.
- Support future improvements to recognition accuracy and nutrition estimation.

### Text-based food search

- Search food information through text using CalorieNinjas as a fallback.
- Present available nutrition information when image analysis is unavailable or uncertain.
- Support a flexible food-logging experience.

### Culturally aware meal planning

- Recommend meals according to personal preferences.
- Support regional food choices and culturally familiar meals.
- Consider religious requirements such as halal preferences.
- Provide a foundation for customized calorie and nutrient targets.

### Health and habit tracking

- Track meals and estimated calorie intake.
- Record water and hydration progress.
- Monitor sleep and daily activity.
- Support step count, heart rate, and workout information where data is available.
- Display progress through a centralized dashboard.

### Workout support

- Display guided workout routines.
- Use Lottie animations to make exercise instructions more engaging.
- Organize routines by activity type, duration, or fitness goal.
- Support progress tracking for completed workouts.

### Reminders and notifications

- Hydration reminders.
- Meal and nutrition reminders.
- Sleep schedule reminders.
- Workout notifications.
- Configurable notification preferences and schedules.

### Offline support

- Cache selected content locally with AsyncStorage.
- Make key information available during temporary connectivity loss.
- Store selected data locally for continued access.
- Provide a foundation for future synchronization improvements.

### Wearable integration foundation

- Prepare for synchronization with health and fitness devices.
- Support a future connection with devices such as Fitbit or Mi Band.
- Provide a modular structure for importing steps, heart rate, sleep, and workout data.

## User Journey

1. The user creates an account and completes the onboarding process.
2. NutriSense collects goals, dietary preferences, region, and relevant restrictions.
3. The user captures a food image or searches for a meal manually.
4. The image is sent to the Python AI/ML analysis service.
5. The service returns an estimated food and nutrition result.
6. The user reviews calories, carbohydrates, protein, fats, and other available information.
7. The user receives meal, hydration, and workout suggestions.
8. Daily activity is displayed on the progress dashboard.
9. Selected information remains available when the device is offline.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Mobile application | React Native, Expo, TypeScript |
| Navigation and UI | React Navigation, reusable React Native components |
| AI/ML service | Python-based food image analysis and nutrition estimation |
| Food image analysis | Python AI/ML processing service |
| Animations | Lottie |
| Authentication | Firebase Authentication |
| Cloud database | Cloud Firestore |
| Local persistence | AsyncStorage, local JSON data |
| Food and nutrition APIs | LogMeal, CalorieNinjas, Spoonacular |
| Development tools | Visual Studio Code, Expo Go, Android Emulator |
| Testing and debugging | Expo development tools, Firebase Console, browser debugging tools |

## Application Modules

- **Authentication and onboarding:** account creation, sign-in, profile setup, and preferences.
- **Nutrition:** food image scanning, AI/ML analysis, food search, nutrition results, meal history, and meal planning.
- **Python AI/ML service:** image processing, food recognition, and estimated nutrition analysis.
- **Health dashboard:** calories, carbohydrates, protein, hydration, sleep, activity, and progress summaries.
- **Workout:** routines, exercise animations, completion tracking, and goals.
- **Notifications:** reminder creation, scheduling, and preference management.
- **Offline storage:** local cache, offline data access, and synchronization preparation.
- **Profile and settings:** user preferences, privacy controls, dietary requirements, and account management.
- **Expert support foundation:** planned communication and professional guidance features.

## Architecture

NutriSense follows a modular client-cloud architecture with a Python AI/ML service for food image analysis:

```text
┌─────────────────────────────────────────────┐
│              NutriSense Mobile App          │
│       React Native + Expo + TypeScript      │
├─────────────────────────────────────────────┤
│ UI Screens • Navigation • State • Validation │
│ Nutrition • Health • Workout • Notifications│
└───────────────┬───────────────┬─────────────┘
                │               │
                │               │
      ┌─────────▼─────────┐ ┌───▼────────────────┐
      │ Firebase Services │ │ Python AI/ML       │
      │ Auth + Firestore  │ │ Food Image Service │
      └─────────┬─────────┘ └───┬────────────────┘
                │               │
                │       ┌───────▼───────────────┐
                │       │ Food Recognition and  │
                │       │ Nutrition Estimation  │
                │       └───────┬───────────────┘
                │               │
                └───────┬───────┘
                        │
               ┌────────▼────────┐
               │ Local Data Layer│
               │ AsyncStorage    │
               │ Offline JSON    │
               └─────────────────┘
```

The mobile application communicates with Firebase for authentication and cloud data, sends food images to the Python AI/ML service for analysis, uses external nutrition services where configured, and stores selected information locally for offline access.

## Project Structure

The exact folders may change during development. The project is organized around the following structure:

```text
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
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

If the Python AI/ML service is maintained in the same repository, it can be organized in a separate backend directory, for example:

```text
backend/
├── app/                    # Python service source code
├── models/                 # AI/ML model files or loading logic
├── services/               # Image processing and nutrition services
├── requirements.txt        # Python dependencies
└── README.md               # Backend-specific instructions
```

Use this backend structure only if it matches the actual repository.

## Getting Started

### Prerequisites

Before running the project, install or configure the following:

- Node.js LTS.
- npm or another compatible package manager.
- Python 3.x for the AI/ML service.
- Expo development tools.
- Expo Go on a compatible mobile device, or an Android emulator/iOS simulator.
- A Firebase project for authentication and Firestore features.
- API credentials for the external services used by your local configuration.

### Install the mobile application

Clone the repository:

```bash
git clone https://github.com/izharahmaad/NutriSence.git
cd NutriSence
```

Install JavaScript dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

You can then:

- Scan the QR code with Expo Go.
- Press `a` to open an Android emulator.
- Press `i` to open an iOS simulator on macOS.
- Press `w` to open a web development build if web support is configured.

### Install the Python AI/ML service

If the Python service is included in the repository, open its directory and create a virtual environment:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Activate it on macOS or Linux:

```bash
source .venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Start the Python service using the command configured by the project. For a FastAPI-based service, the command may be:

```bash
uvicorn app.main:app --reload
```

Use the actual module path and startup command defined in your Python project.

## Environment Configuration

Do not commit API keys, private credentials, service-account files, model secrets, or other sensitive information to GitHub. Create local environment files according to the configuration used by the mobile application and Python service.

Example mobile configuration:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
EXPO_PUBLIC_LOGMEAL_API_KEY=your_logmeal_api_key
EXPO_PUBLIC_CALORIENINJAS_API_KEY=your_calorieninjas_api_key
EXPO_PUBLIC_SPOONACULAR_API_KEY=your_spoonacular_api_key
EXPO_PUBLIC_AI_SERVICE_URL=http://your-python-service-url
```

Example Python service configuration:

```env
MODEL_PATH=path_to_your_model
LOGMEAL_API_KEY=your_logmeal_api_key
CALORIENINJAS_API_KEY=your_calorieninjas_api_key
```

Use only the variables that the application actually reads. Add environment files to `.gitignore`:

```gitignore
.env
.env.*
!.env.example
.venv/
__pycache__/
```

> Values exposed through a mobile application should not be treated as server-side secrets. Sensitive operations should be moved to a secure backend or protected server function.

## Development Commands

### Mobile application

```bash
# Start the development server
npx expo start

# Start with a cleared Metro cache
npx expo start -c

# Check the project for common issues
npx expo-doctor

# Run the TypeScript compiler without emitting files
npx tsc --noEmit
```

### Python AI/ML service

```bash
# Activate the virtual environment on Windows PowerShell
.venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt

# Start a FastAPI service if configured in the project
uvicorn app.main:app --reload
```

The available commands depend on the scripts, dependencies, and service structure defined in the project.

## Data and Privacy

NutriSense may process profile information, dietary preferences, food images, nutrition records, activity information, and data returned by connected services. The application should:

- Collect only information required for the selected feature.
- Explain how user data and food images are stored and used.
- Protect Firestore data with appropriate security rules.
- Avoid storing sensitive API keys in the mobile client.
- Secure communication between the mobile application and Python service.
- Provide users with appropriate account and data-management options.
- Treat health-related information and food images as sensitive.
- Avoid presenting estimated nutrition data as medical advice.

## Testing

The project can be tested through the following workflow:

- Run the mobile application with Expo Go or an emulator.
- Start the Python AI/ML service locally or connect to its configured endpoint.
- Test onboarding, authentication, and profile updates.
- Test image capture, image upload, and food analysis.
- Verify returned calories, carbohydrates, protein, fats, and other nutrition fields.
- Test invalid, empty, large, and low-quality images.
- Test API failure and text-search fallback behavior.
- Test empty, invalid, and slow network responses.
- Test offline access and reconnection behavior.
- Test notification permissions and reminder scheduling.
- Test Firestore reads, writes, and security rules.
- Test different screen sizes and accessibility settings.
- Run TypeScript checks and review console warnings before committing.
- Test Python endpoints and model inference using representative food images.

## Roadmap

The following improvements are planned for future versions of NutriSense:

### Food analysis and nutrition

- Improve food recognition for regional and homemade meals.
- Add portion-size estimation and confidence indicators.
- Improve carbohydrate, protein, fat, calorie, and nutrient estimation.
- Support barcode scanning and packaged-food labels.
- Add ingredient and allergen detection.
- Improve image preprocessing for different lighting and image quality.
- Allow users to correct detected food items and nutrition results.
- Improve meal recommendations using user history and feedback.

### Personalization

- Add configurable calorie and nutrient targets.
- Improve support for weight management, muscle gain, and general wellness goals.
- Add meal replacement and ingredient-substitution suggestions.
- Add regional food databases for Pakistani and South Asian meals.
- Improve halal, vegetarian, vegan, allergy, and intolerance filters.

### Health and activity tracking

- Add weekly and monthly progress reports.
- Add charts for calories, carbohydrates, protein, hydration, sleep, activity, and workout consistency.
- Add habit streaks and progress milestones.
- Improve manual health-data entry and validation.
- Improve Fitbit and Mi Band synchronization.

### Offline experience

- Improve local data storage for offline use.
- Queue selected actions while the device is offline.
- Synchronize pending data when connectivity returns.
- Display synchronization status and last-updated information.
- Improve access to saved meal plans and nutrition information offline.

### AI and safety

- Add explanations for AI-generated nutrition recommendations.
- Add confidence indicators and correction options for food recognition.
- Improve safety handling for medical and allergy-related questions.
- Provide clearer guidance to consult qualified health professionals when appropriate.
- Improve monitoring of inaccurate results and external API errors.

### User experience

- Add dark mode and improved accessibility support.
- Add multilingual support, including Urdu and English.
- Improve onboarding and first-time user guidance.
- Add customizable dashboard sections.
- Improve screen-reader labels and text-size support.

### Professional support

- Add verified dietitian and fitness-professional support.
- Add educational nutrition content.
- Add recipe sharing with nutritional information.
- Add a moderated expert-support feature with clear health disclaimers.

### Engineering and quality

- Add unit, integration, and end-to-end testing.
- Add continuous integration with GitHub Actions.
- Add automated linting and type checking for pull requests.
- Improve error handling and performance monitoring.
- Add secure backend functions for protected API calls.
- Improve deployment and release documentation.

## Limitations

- Nutrition results from AI/ML models and external APIs are estimates.
- Food recognition can be affected by image quality, lighting, ingredients, preparation methods, and portion visibility.
- A single food image may contain multiple ingredients that are difficult to identify accurately.
- Nutrition values may vary between recipes, brands, serving sizes, and regional dishes.
- Wearable support depends on device availability, platform permissions, and API access.
- Offline functionality may not include every feature.
- Users with medical conditions, allergies, or special dietary needs should consult a qualified professional.

## Academic Context

NutriSense was developed as a Bachelor of Computer Science final-year academic project at Abdul Wali Khan University Mardan.

- **Developer:** Izhar Ahmad
- **Degree:** Bachelor of Computer Science
- **Study period:** 2021–2025
- **Supervisor:** Mr. Arjumand Yar Khan

## Contributing

Contributions, suggestions, and issue reports are welcome while the project is under development.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make focused changes and test them locally.
4. Commit your work:

   ```bash
   git commit -m "Describe your change"
   ```

5. Push the branch:

   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a pull request with a clear title, description, testing notes, and screenshots where useful.

Please do not include secrets, private credentials, model files, or unrelated changes in a pull request.

## License

License details should be added before public distribution. If this project is intended to remain proprietary, replace this section with the appropriate copyright and usage notice. If you choose an open-source license, add the matching `LICENSE` file to the repository.

## Contact

- **Developer:** Izhar Ahmad
- **GitHub:** [@izharahmaad](https://github.com/izharahmaad)
- **Project:** [NutriSence](https://github.com/izharahmaad/NutriSence)

---

Made with React Native, Expo, TypeScript, Python, AI/ML, and Firebase, with a focus on personalized and culturally aware digital wellness. 🍎
