import { useState, useEffect } from 'react';
import {
  Flex,
  VStack,
  KeyboardAvoidingView,
  Input,
  Button,
  Text,
  Center,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppBrand from '../../../components/AppBrand';
import { useRouter } from 'expo-router';
import { Feather, AntDesign } from '@expo/vector-icons';
import {
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { COLORS, SIZES, FONTS, icons } from '../../../constants';
const IS_AUTHENTICATED = 'IS_AUTHENTICATED';
const USER_NAME = 'USER_NAME';

export default function SigninPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });
  async function signIn(data) {
    const { username, password } = data;
    try {
      setLoading(true);
      Alert.alert('Success', 'You are logged in');
      await AsyncStorage.setItem(IS_AUTHENTICATED, 'true');
      await AsyncStorage.setItem(USER_NAME, username);
      router.push('/authScreen');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error signing in', error);
      Alert.alert('error', error?.message);
    }
  }

  useEffect(() => {
    checkIfLaunched();
  }, []);

  async function checkIfLaunched() {
    try {
      const isAuthenticated = await AsyncStorage.getItem(IS_AUTHENTICATED);
      console.log(isAuthenticated);
      if (isAuthenticated) {
        return router.push('/authScreen');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <KeyboardAvoidingView
      background="black"
      style={{ flex: 1, paddingBottom: 40 }}
    >
      <Flex
        safeArea
        flex={1}
        justifyContent="space-between"
        background="black"
        paddingX={5}
      >
        <VStack>
          <AppBrand></AppBrand>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Input
                  type="text"
                  fontSize={35}
                  paddingLeft="0"
                  fontWeight="bold"
                  borderWidth={0}
                  placeholderTextColor={'trueGray.600'}
                  color="white"
                  _focus={{
                    bg: 'black',
                    selectionColor: 'white',
                    color: 'white',
                  }}
                  placeholder="Username"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  autoFocus
                />
                {errors?.username && (
                  <Text color={'trueGray.400'}>
                    {errors?.username?.message || 'Invalid username'}
                  </Text>
                )}
              </>
            )}
            name="username"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  InputRightElement={
                    <>
                      {showPassword ? (
                        <Feather
                          name="eye"
                          size={24}
                          color="gray"
                          onPress={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <Feather
                          name="eye-off"
                          size={24}
                          color="gray"
                          onPress={() => setShowPassword(!showPassword)}
                        />
                      )}
                    </>
                  }
                  fontSize={35}
                  paddingLeft="0"
                  paddingTop="5"
                  fontWeight="bold"
                  borderWidth={0}
                  placeholderTextColor={'trueGray.600'}
                  color="white"
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
                    {errors?.password?.message || 'Invalid password'}
                  </Text>
                )}
              </>
            )}
            name="password"
          />
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
              background="white"
              _text={{ color: 'black', fontWeight: 'bold' }}
              size="lg"
              _pressed={{ bg: 'trueGray.400' }}
              _disabled={{ bg: 'trueGray.500' }}
              isDisabled={
                !watch('username') || !watch('password') || loading
                  ? true
                  : false
              }
              borderRadius="2xl"
              onPress={handleSubmit(signIn)}
            >
              <AntDesign
                name="login"
                size={24}
                color="black"
                style={{ padding: 3 }}
              >
                {' '}
                Login
              </AntDesign>
            </Button>
          )}

          <Flex
            flexDirection="row"
            justifyContent="space-between"
            paddingTop={5}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: COLORS.gray,
                  ...FONTS.h4,
                }}
              >
                Forgot password?{' '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                router.push('/auth/signup/username');
              }}
            >
              <Image
                source={icons.user}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.gray,
                }}
              />
              <Text
                style={{
                  marginLeft: SIZES.padding * 1,
                  color: COLORS.gray,
                  ...FONTS.h4,
                }}
              >
                Sign up
              </Text>
            </TouchableOpacity>
          </Flex>
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
