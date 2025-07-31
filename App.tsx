// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens (using module‐resolver aliases)
import TipsScreen from "@screens/TipsScreen";
import LoginScreen from "@screens/LoginScreen";
import CreativeProfile1Screen from "@screens/CreativeProfile1Screen";
import CreativeProfile2Screen from "@screens/CreativeProfile2Screen";
import CreativeProfile3Screen from "@screens/CreativeProfile3Screen";
import CreativeProfile4Screen from "@screens/CreativeProfile4Screen";
import CreativeProfile5Screen from "@screens/CreativeProfile5Screen";
import HomeScreen from "@screens/HomeScreen";
import DietPlanScreen from "@screens/DietPlanScreen";
import CaloriesScreen from "@screens/CaloriesScreen";
import CameraScreen from "@screens/CameraScreen";
import ActivityScreen from "@screens/ActivityScreen";
import ProfileScreen from "@screens/ProfileScreen";
import WaistWorkoutScreen from "@screens/WaistWorkoutScreen";
import EditProfileScreen from "@screens/EditProfileScreen";
import NotificationScreen from "@screens/NotificationScreen";
import EditPlanScreen from "@screens/EditPlanScreen";
import MyProgressScreen from "@screens/MyProgressScreen";
import MyScanScreen from "@screens/MyScanScreen";
import SettingsScreen from "@screens/SettingsScreen";
import HelpScreen from "@screens/HelpScreen";
import ThemeScreen from "@screens/ThemeScreen";
import ContactDietitianScreen from "@screens/ContactDietitianScreen";
import ScanDetailsScreen from "@screens/ScanDetailsScreen";
import StepsScreen from "@screens/StepsScreen";
import WaterScreen from "@screens/WaterScreen";
import HeartScreen from "@screens/HeartScreen";
import SleepScreen from "@screens/SleepScreen";
import MyPlanTodayScreen from "@screens/MyPlanTodayScreen";
import BreakfastMealScreen from "@screens/BreakfastMealScreen";
import LunchMealScreen from "@screens/LunchMealScreen";
import DinnerMealScreen from "@screens/DinnerMealScreen";
import FilteredResultsScreen from "@screens/FilteredResultsScreen";
import TodayWorkoutScreen from "@screens/TodayWorkoutScreen";
import WorkoutGoalScreen from "@screens/WorkoutGoalScreen";
import { firebaseConfig } from "@config/firebaseConfig";
import { initializeApp } from "firebase/app";
import ForgotPasswordScreen from "@screens/ForgotPasswordScreen ";
import ConnectDeviceScreen from "@screens/ConnectDeviceScreen"
import AboutAppScreen from "@screens/AboutAppScreen"

export type RootStackParamList = {
  Tips: undefined;
  Login: undefined;
  CreativeProfile1: undefined;
  CreativeProfile2: undefined;
  CreativeProfile3: undefined;
  CreativeProfile4: undefined;
  CreativeProfile5: undefined;
  Home: undefined;
  DietPlan: undefined;
  Calories: undefined;
  Camera: undefined;
  Activity: undefined;
  Profile: undefined;
  WaistWorkout: undefined;
  EditProfile: undefined;
  Notification: undefined;
  EditPlan: undefined;
  MyProgress: undefined;
  MyScan: undefined;
  Settings: undefined;
  Help: undefined;
  Theme: undefined;
  ContactDietitian: undefined;
  ScanDetails: undefined;
  Steps: undefined;
  Water: undefined;
  Heart: undefined;
  Sleep: undefined;
  MyPlanToday: undefined;
  BreakfastMeal: undefined;
  LunchMeal: undefined;
  DinnerMeal: undefined;
  FilteredResults: undefined;
  TodayWorkout: undefined;
  WorkoutGoal: undefined;
  ConnectDevice: undefined;
  ForgetPassword: undefined;
  AboutApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 2️⃣ Centralize your routes for clarity
const routes: Array<{
  name: keyof RootStackParamList;
  component: React.ComponentType<any>;
}> = [
  { name: "Tips", component: TipsScreen },
  { name: "Login", component: LoginScreen },
  { name: "ForgetPassword", component: ForgotPasswordScreen },
  { name: "CreativeProfile1", component: CreativeProfile1Screen },
  { name: "CreativeProfile2", component: CreativeProfile2Screen },
  { name: "CreativeProfile3", component: CreativeProfile3Screen },
  { name: "CreativeProfile4", component: CreativeProfile4Screen },
  { name: "CreativeProfile5", component: CreativeProfile5Screen },
  { name: "Home", component: HomeScreen },
  { name: "DietPlan", component: DietPlanScreen },
  { name: "Calories", component: CaloriesScreen },
  { name: "Camera", component: CameraScreen },
  { name: "Activity", component: ActivityScreen },
  { name: "Profile", component: ProfileScreen },
  { name: "WaistWorkout", component: WaistWorkoutScreen },
  { name: "EditProfile", component: EditProfileScreen },
  { name: "Notification", component: NotificationScreen },
  { name: "EditPlan", component: EditPlanScreen },
  { name: "MyProgress", component: MyProgressScreen },
  { name: "MyScan", component: MyScanScreen },
  { name: "Settings", component: SettingsScreen },
  { name: "Help", component: HelpScreen },
  { name: "Theme", component: ThemeScreen },
  { name: "ContactDietitian", component: ContactDietitianScreen },
  { name: "ScanDetails", component: ScanDetailsScreen },
  { name: "Steps", component: StepsScreen },
  { name: "Water", component: WaterScreen },
  { name: "Heart", component: HeartScreen },
  { name: "Sleep", component: SleepScreen },
  { name: "MyPlanToday", component: MyPlanTodayScreen },
  { name: "BreakfastMeal", component: BreakfastMealScreen },
  { name: "LunchMeal", component: LunchMealScreen },
  { name: "DinnerMeal", component: DinnerMealScreen },
  { name: "FilteredResults", component: FilteredResultsScreen },
  { name: "TodayWorkout", component: TodayWorkoutScreen },
  { name: "WorkoutGoal", component: WorkoutGoalScreen },
  {name: "ConnectDevice", component: ConnectDeviceScreen},
  {name: "AboutApp", component: AboutAppScreen},
];

export default function App() {
  try {
    initializeApp(firebaseConfig);
  } catch (err) {
    console.log(err);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Tips"
      >
        {routes.map(({ name, component }) => (
          <Stack.Screen key={name} name={name} component={component} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
