import { View, Text, Alert, Platform, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';

import { authStyles } from '../../assets/styles/auth.styles';
import { Image } from 'expo-image';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const SignInScreen = () => {

  const router = useRouter();

  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Please enter both email and password');
      return;
    }
    if (!isLoaded) return;

    setLoading(true);

    try {

      const signInAttempt = await signIn.create({
        identifier: email,
        password: password
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        Alert.alert('Sign in failed, please try again');
        console.log(JSON.stringify(signInAttempt, null, 2));
      }

    } catch (error) {
      Alert.alert("Error", error.errors?.[0]?.message || "Sign in failed")
    }

    finally {
      setLoading(false);
    }
  }

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >

        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsHorizontalScrollIndicator={false}
        >

          <View
            style={authStyles.imageContainer}
          >
            <Image
              source={require('../../assets/images/i1.png')}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Welcome Back</Text>

          {/* Form container */}

          <View style={authStyles.formContainer}>

            {/* Email input field */}
            <View style={authStyles.inputContainer}>

              <TextInput
                style={authStyles.textInput}
                placeholder="Enter Your Email"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* password input field */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter Your Password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            {/* Sign in button */}
            <TouchableOpacity
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
            </TouchableOpacity>

            {/* Sign Up link */}

            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => router.push('/(auth)/sign-up')}
            >
              <Text style={authStyles.linkText}>Don&apos;t have an account? <Text style={authStyles.link}>Sign Up</Text></Text>
            </TouchableOpacity>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>
    </View>
  )
}

export default SignInScreen