import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Flex, VStack } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Auth } from 'aws-amplify';

import { COLORS, SIZES, FONTS, icons, images } from '../../constants';

const IS_AUTHENTICATED = 'IS_AUTHENTICATED';

export default function AuthScreen() {
  const router = useRouter();
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function signOut() {
    try {
      await Auth.signOut();
      await AsyncStorage.removeItem(IS_AUTHENTICATED);
      router.push('/auth/signin/signinPage');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  // Check if hardware supports biometrics
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });

  function onAuthenticate() {
    const auth = LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate',
      fallbackLabel: 'Enter Password',
    });
    auth.then((result) => {
      setIsAuthenticated(result.success);
      router.push({
        pathname: '/biometric/home',
      });
      console.log(result);
    });
  }

  function renderHeader() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: SIZES.padding * 6,
          paddingHorizontal: SIZES.padding * 2,
        }}
        onPress={() => signOut()}
      >
        <Image
          source={icons.back}
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
            tintColor: COLORS.white,
          }}
        />

        <Text
          style={{
            marginLeft: SIZES.padding * 1.5,
            color: COLORS.white,
            ...FONTS.h4,
          }}
        >
          Sign Out
        </Text>
      </TouchableOpacity>
    );
  }

  function renderLogo() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 5,
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={images.Logo}
          resizeMode="contain"
          style={{
            width: '60%',
          }}
        />
      </View>
    );
  }

  function renderButton() {
    return (
      <View style={{ margin: SIZES.padding * 3 }}>
        <TouchableOpacity
          style={{
            height: 60,
            backgroundColor: COLORS.white,
            borderRadius: SIZES.radius / 1.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => onAuthenticate()}
        >
          <Text style={{ color: COLORS.black, ...FONTS.h3 }}>
            <Entypo
              name="fingerprint"
              size={24}
              color="black"
              style={{
                padding: 5,
              }}
            >
              {' '}
              Authenticate
            </Entypo>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
      backgroundColor={COLORS.primary}
    >
      <Flex
        safeArea
        flex={1}
        justifyContent="space-between"
        background="black"
        paddingX={2}
      >
        <VStack>
          {renderHeader()}
          {renderLogo()}
        </VStack>
        <VStack paddingY={10}>{renderButton()}</VStack>
      </Flex>
    </KeyboardAvoidingView>
  );
}
