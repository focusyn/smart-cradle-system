import React, { useState, useEffect } from 'react';
import {
  Flex,
  VStack,
  KeyboardAvoidingView,
  Button,
  Text,
  View,
  Input,
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
import { StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

const CELL_COUNT = 6;
const PasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-+_!@#$%^&*., ?]).+$/;

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
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      newPassword: '',
    },
  });

  async function confirmReset(data) {
    const { newPassword } = data;
    try {
      setLoading(true);
      await Auth.forgotPasswordSubmit(username, value, newPassword);
      Alert.alert('Success', 'Password reset successful');
      router.push({
        pathname: '/',
      });
      setLoading(false);
      console.log('user signed up successfully!');
    } catch (error) {
      setLoading(false);
      console.log('error confirming sign up', error);
      Alert.alert('Error', error?.message);
    }
  }

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
        paddingTop={10}
      >
        <VStack>
          <AppHeading>Reset Your Password</AppHeading>
          <View style={{ height: 20 }} />
          <Controller
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password should be at least 8 characters long',
              },
              pattern: {
                value: PasswordRegex,
                message:
                  'Password should contain at least one uppercase letter, one lowercase letter, one special character and one digit',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Input
                  type="text"
                  marginX="auto"
                  fontSize={35}
                  fontWeight="bold"
                  borderWidth={0}
                  color="white"
                  placeholderTextColor={'trueGray.600'}
                  _focus={{
                    bg: 'black',
                    selectionColor: 'white',
                    color: 'white',
                  }}
                  placeholder="New Password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  autoFocus
                />
                {errors?.newPassword && (
                  <Text color={'trueGray.400'}>
                    {errors?.newPassword?.message}
                  </Text>
                )}
              </>
            )}
            name="newPassword"
          />
          <Text
            paddingTop={10}
            onPress={() => router.back()}
            color={'trueGray.300'}
            fontSize={20}
          >
            We've sent a verification code to your email address, please enter
          </Text>
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

          <Text color={'trueGray.400'} paddingTop="10" paddingX={6}>
            Didn't receive the code?{' '}
            <Text
              onPress={() => router.back()}
              color={'trueGray.200'}
              fontSize={16}
            >
              Try again
            </Text>
          </Text>
        </VStack>
        <VStack>
          {loading ? (
            <Center>
              <ActivityIndicator
                visible={loading}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
              />
            </Center>
          ) : (
            <Button
              isDisabled={
                value.length < 6 || errors?.newPassword ? true : false
              }
              background="white"
              _text={{ color: 'black', fontWeight: 'bold' }}
              size="lg"
              _pressed={{ bg: 'trueGray.400' }}
              _disabled={{ bg: 'trueGray.400' }}
              borderRadius="2xl"
              onPress={handleSubmit(confirmReset)}
            >
              Submit
            </Button>
          )}
        </VStack>
      </Flex>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  codeFiledRoot: {
    marginTop: 20,
    width: 280,
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
  spinnerTextStyle: {
    color: '#FFF',
  },
});
