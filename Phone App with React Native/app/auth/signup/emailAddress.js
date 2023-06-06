import React, { useState } from 'react';
import {
  Flex,
  VStack,
  KeyboardAvoidingView,
  Input,
  Button,
  Text,
  Center,
} from 'native-base';
import { Alert, ActivityIndicator, StyleSheet } from 'react-native';
import AppHeading from '../../../components/AppHeading';
import { useRouter, useSearchParams } from 'expo-router';
import { Auth } from 'aws-amplify';
import { useForm, Controller } from 'react-hook-form';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const PasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-+_!@#$%^&*., ?]).+$/;

export default function EmailAddress() {
  const params = useSearchParams();
  const router = useRouter();
  const { name, username } = params;
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const pwd = watch('password');

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      setLoading(true);
      router.push({
        pathname: '/authScreen',
        params: {
          username: username,
        },
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error signing up:', error);
      Alert.alert('error', error?.message);
    }
  };

  return (
    <KeyboardAvoidingView
      background="black"
      style={{ flex: 1, paddingBottom: 15 }}
    >
      <Flex
        safeArea
        flex={1}
        justifyContent="space-between"
        background="black"
        paddingX={5}
        paddingY={10}
      >
        <VStack>
          {/* <AppBrand></AppBrand> */}
          <AppHeading>
            Create account using your email address & password
          </AppHeading>
          <Controller
            control={control}
            rules={{
              required: true,
              pattern: {
                value: EMAIL_REGEX,
                message: 'Invalid email address',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Input
                  fontSize={35}
                  paddingLeft="0"
                  fontWeight="bold"
                  borderWidth={0}
                  color="white"
                  placeholderTextColor={'trueGray.600'}
                  _focus={{
                    bg: 'black',
                    selectionColor: 'white',
                    color: 'white',
                  }}
                  placeholder="Email Address"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  autoFocus
                />
                {errors?.email && (
                  <Text color={'trueGray.400'}>Invalid email address</Text>
                )}
              </>
            )}
            name="email"
          />

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
                  fontSize={35}
                  paddingLeft="0"
                  fontWeight="bold"
                  borderWidth={0}
                  color="white"
                  placeholderTextColor={'trueGray.600'}
                  _focus={{
                    bg: 'black',
                    selectionColor: 'white',
                    color: 'white',
                  }}
                  placeholder="Password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
                {errors?.password && (
                  <Text color={'trueGray.400'}>
                    {errors?.password?.message}
                  </Text>
                )}
              </>
            )}
            name="password"
          />
          <Controller
            control={control}
            rules={{
              validate: (value) =>
                value === pwd || 'The passwords do not match',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Input
                  fontSize={35}
                  paddingLeft="0"
                  fontWeight="bold"
                  borderWidth={0}
                  color="white"
                  placeholderTextColor={'trueGray.600'}
                  _focus={{
                    bg: 'black',
                    selectionColor: 'white',
                    color: 'white',
                  }}
                  placeholder="Confirm Password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
                {errors?.confirmPassword && (
                  <Text color={'trueGray.400'}>
                    {errors?.confirmPassword?.message}
                  </Text>
                )}
              </>
            )}
            name="confirmPassword"
          />
        </VStack>
        <VStack>
          <Text
            color="trueGray.600"
            fontSize="sm"
            textAlign="center"
            paddingBottom={5}
          >
            By tapping "Continue", you agree to our{' '}
            <Text color={'trueGray.400'}>Privacy Policy</Text> and{' '}
            <Text color={'trueGray.400'}>Terms of Service</Text>.
          </Text>
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
              background="white"
              _text={{ color: 'black', fontWeight: 'bold' }}
              size="lg"
              _pressed={{ bg: 'trueGray.400' }}
              _disabled={{ bg: 'trueGray.400' }}
              borderRadius="2xl"
              isDisabled={Object.keys(errors).length > 0}
              onPress={handleSubmit(onSubmit)}
            >
              Continue
            </Button>
          )}
        </VStack>
      </Flex>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },
});
