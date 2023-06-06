import React, { useState, useEffect } from 'react';
import {
  Flex,
  VStack,
  KeyboardAvoidingView,
  Input,
  Button,
  Text,
  View,
} from 'native-base';
import AppHeading from '../../../components/AppHeading';
import { useRouter, useSearchParams } from 'expo-router';
import { Auth } from 'aws-amplify';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { StyleSheet, Alert } from 'react-native';

const CELL_COUNT = 6;
const RESEND_OTP_TIME_LIMIT = 60;

export default function CodeVerify() {
  const router = useRouter();
  const params = useSearchParams();
  const { username } = params;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  let resendOtpTimerInterval;
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT
  );

  async function confirmSignUp() {
    try {
      await Auth.confirmSignUp(username, value);
      router.push({
        pathname: '/authScreen',
        params: {
          username: username,
        },
      });
      console.log('user signed up successfully!');
    } catch (error) {
      console.log('error confirming sign up', error);
      Alert.alert('Error', 'Invalid OTP');
    }
  }

  //to start resent otp option
  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  //on click of resend button
  async function resendConfirmationCode() {
    //clear input field
    setValue('');
    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    startResendOtpTimer();
    try {
      await Auth.resendSignUp(username);
      console.log('code resent successfully');
    } catch (err) {
      console.log('error resending code: ', err);
      Alert.alert('Error', 'Error resending code');
    }
  }

  //start timer on screen on launch
  useEffect(() => {
    startResendOtpTimer();
    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);

  return (
    <KeyboardAvoidingView
      background="black"
      style={{ flex: 1, paddingBottom: 30 }}
    >
      <Flex
        safeArea
        flex={1}
        justifyContent="space-between"
        background="black"
        paddingX={5}
      >
        <VStack>
          <View style={{ height: 50 }}></View>
          <AppHeading>
            We've sent a code to your email address. Please enter it below.
          </AppHeading>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFiledRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <View
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[styles.cellRoot, isFocused && styles.focusCell]}
              >
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />
          {resendButtonDisabledTime > 0 && (
            <Text color={'trueGray.400'} paddingTop="10" paddingX={6}>
              Resend Verification Code in{'  '}
              <Text color={'trueGray.200'} fontSize={16}>
                {resendButtonDisabledTime}s
              </Text>
            </Text>
          )}
        </VStack>
        <VStack>
          <Flex
            flexDirection="row"
            justifyContent="space-evenly"
            paddingTop={5}
          >
            <Button
              isDisabled={resendButtonDisabledTime > 0 ? true : false}
              background="white"
              _text={{ color: 'black', fontWeight: 'bold' }}
              size="lg"
              _pressed={{ bg: 'trueGray.400' }}
              _disabled={{ bg: 'trueGray.400' }}
              borderRadius="2xl"
              onPress={() => {
                resendConfirmationCode();
              }}
            >
              Resend Code
            </Button>
            <Button
              width={200}
              isDisabled={value.length < 6 ? true : false}
              background="white"
              _text={{ color: 'black', fontWeight: 'bold' }}
              size="lg"
              _pressed={{ bg: 'trueGray.400' }}
              _disabled={{ bg: 'trueGray.400' }}
              borderRadius="2xl"
              onPress={() => {
                confirmSignUp();
              }}
            >
              Confirm
            </Button>
          </Flex>
        </VStack>
      </Flex>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { padding: 10, minHeight: 300 },
  title: { textAlign: 'center', fontSize: 25 },
  codeFiledRoot: {
    marginTop: 100,
    width: 300,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    padding: 10,
    color: '#ccc',
    fontSize: 25,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },
});
