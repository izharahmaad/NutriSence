import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const auth = getAuth();
  const navigation = useNavigation();

  const handleForgotPassword = async () => {
    if (!email) {
      return Alert.alert("Error", "Please enter your email address.");
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Success",
        "A password reset email has been sent to your email address."
      );
      navigation.goBack(); // Navigate back to the Login screen
    } catch (error: any) {
      console.error("Password Reset Error:", error.message);
      Alert.alert("Error", error.message || "Failed to send password reset email.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AntDesign
        name="lock"
        size={48}
        color="#4CAF50"
        style={styles.icon}
      />
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address below and we'll send you a link to reset your password.
      </Text>

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
          name="mail"
          size={20}
          color={email ? "#4CAF50" : "#ccc"}
        />
      </View>

      {/* Reset Password Button */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleForgotPassword}
      >
        <Text style={styles.resetText}>Send Reset Email</Text>
      </TouchableOpacity>
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
  subtitle: {
    fontSize: 16,
    color: "#4CAF50",
    marginBottom: 28,
    textAlign: "center",
  },
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
  resetButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 20,
    width: "100%",
  },
  resetText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
});