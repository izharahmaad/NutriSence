import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

// Define the navigation prop for this screen
type LoginNavProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavProp>();
  const auth = getAuth();
  const [isSignup, setIsSignup] = useState(false); // Toggle between Login and Sign Up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // For Sign Up only
  const [showPassword, setShowPassword] = useState(false); // Show/Hide password


   // Social login hooks
  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useAuthRequest({
      clientId:
        "125012943102-aq1ihfekeajc0ppm35b31p7h62smm4ec.apps.googleusercontent.com",
      androidClientId:
        "125012943102-aq1ihfekeajc0ppm35b31p7h62smm4ec.apps.googleusercontent.com",
      iosClientId: undefined, // Add if you have one
      webClientId: undefined, // Add if you have one
    });
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: "YOUR_FACEBOOK_APP_ID", // Replace with your Facebook App ID
  });

  // Handle Google Auth
  useEffect(() => {
    if (googleResponse?.type === "success") {
      const { authentication } = googleResponse;
      if (authentication?.idToken) {
        const credential = GoogleAuthProvider.credential(
          authentication.idToken
        );
        signInWithCredential(auth, credential)
          .then(() => {
            navigation.replace("CreativeProfile1");
          })
          .catch((err: any) => {
            Alert.alert("Google Sign-In Error", err.message);
          });
      }
    }
  }, [googleResponse]);

  // Handle Facebook Auth
  useEffect(() => {
    if (fbResponse?.type === "success") {
      const { authentication } = fbResponse;
      if (authentication?.accessToken) {
        const credential = FacebookAuthProvider.credential(
          authentication.accessToken
        );
        signInWithCredential(auth, credential)
          .then(() => {
            navigation.replace("CreativeProfile1");
          })
          .catch((err: any) => {
            Alert.alert("Facebook Sign-In Error", err.message);
          });
      }
    }
  }, [fbResponse]);

  useEffect(() => {
    console.log("Loading saved credentials...");
    (async () => {
      const saved = await AsyncStorage.getItem("user");
      if (saved) {
        const { email, password } = JSON.parse(saved);
        setEmail(email);
        setPassword(password);
      }
    })();
  }, []);

  // Function to validate password strength
  const isStrongPassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async () => {
    try {
      if (isSignup) {
        if (!isStrongPassword(password)) {
          return Alert.alert(
            "Weak Password",
            "Your password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters."
          );
        }

        if (password !== confirmPassword) {
          return Alert.alert("Error", "Passwords do not match");
        }

        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user data in Firestore with minimal data
        const userDoc = doc(db, "users", `profile_${user.uid}`);
        await setDoc(userDoc, {
          email,
          createdAt: serverTimestamp(),
        });

        Alert.alert("Success", "Account created successfully");

        // Save user credentials locally (optional)
        await AsyncStorage.setItem("user", JSON.stringify({ email, password }));

        // Navigate forward, replacing Login in history
        navigation.replace("CreativeProfile1");
      } else {
        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Save user credentials locally (optional)
        await AsyncStorage.setItem("user", JSON.stringify({ email, password }));

        Alert.alert("Success", "Login successful");
        navigation.replace("CreativeProfile1");
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Firebase Error", err.message || "Something went wrong");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Ionicons
        name="log-in-outline"
        size={48}
        color="#4CAF50"
        style={styles.icon}
      />
      <Text style={styles.title}>{isSignup ? "Sign Up" : "Login"}</Text>
      <Text style={styles.subtitle}>Welcome to NutriSense</Text>

      {/* Email Input */}
      <View style={styles.inputBox}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AntDesign
          name="checkcircle"
          size={20}
          color={email ? "#4CAF50" : "#ccc"}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputBox}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          style={styles.input}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
          <Feather
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password (Sign Up only) */}
      {isSignup && (
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            style={styles.input}
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Feather name="lock" size={20} color="#888" />
        </View>
      )}

      {/* Forgot Password (Login only) */}
      {!isSignup && (
        <TouchableOpacity style={styles.forgotWrapper} onPress={() => navigation.navigate("ForgetPassword")}>
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
        <Text style={styles.loginText}>{isSignup ? "Sign Up" : "Login"}</Text>
      </TouchableOpacity>

      {/* Toggle Sign Up / Login */}
      <Text style={styles.signupText}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Text style={styles.linkText} onPress={() => setIsSignup((p) => !p)}>
          {isSignup ? "Log in" : "Sign up"}
        </Text>
      </Text>

      {/* Social Login Buttons */}
      <View style={styles.socialRow}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => googlePromptAsync()}
          disabled={!googleRequest}
        >
          <AntDesign name="google" size={24} color="#EA4335" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => fbPromptAsync()}
          disabled={!fbRequest}
        >
          <AntDesign name="facebook-square" size={24} color="#3b5998" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 30,
    alignItems: "center",
  },
  icon: { marginBottom: 8 },
  title: { fontSize: 30, fontWeight: "700", color: "#121433" },
  subtitle: { fontSize: 16, color: "#4CAF50", marginBottom: 28 },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 2,
  },
  input: { flex: 1, fontSize: 16, color: "#333" },
  forgotWrapper: { alignSelf: "flex-end", marginBottom: 25 },
  forgot: { color: "#999", fontSize: 13 },
  loginButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 20,
    width: "100%",
  },
  loginText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  signupText: {
    textAlign: "center",
    fontSize: 15,
    color: "#888",
    marginBottom: 20,
  },
  linkText: { color: "#4CAF50", fontWeight: "600" },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 30 },
  socialButton: {
    backgroundColor: "#f0f0f0",
    padding: 14,
    borderRadius: 40,
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
});