import {
  Flex,
  VStack,
  KeyboardAvoidingView,
  Input,
  Button,
  Text,
} from 'native-base';
import AppHeading from '../../../components/AppHeading';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Auth } from 'aws-amplify';
import { useForm, Controller } from 'react-hook-form';
import { Alert, Image, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, FONTS, icons, images } from '../../../constants';

export default function ForgotPassword() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      username: '',
    },
  });

  const onSendPressed = async (data) => {
    const { username } = data;
    try {
      await Auth.forgotPassword(username);
      router.push({
        pathname: '/auth/signup/resetPassword',
        params: {
          username: username,
        },
      });
    } catch (e) {
      Alert.alert('Oops', e.message);
    }
  };
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
        paddingTop={10}
      >
        <VStack>
          <AppHeading>Forgot password</AppHeading>
          <Controller
            control={control}
            rules={{
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username should be at least 3 characters long',
              },
              maxLength: {
                value: 24,
                message: 'Username should be max 24 characters long',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Input
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
                  placeholder="Username"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
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
        </VStack>
        <VStack>
          <Flex
            safeArea
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
            paddingTop={5}
          >
            <TouchableOpacity
              onPress={() => router.push('/auth/signin/signinPage')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: SIZES.padding * 2,
              }}
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
                Login
              </Text>
            </TouchableOpacity>
            <Button
              width={230}
              background="white"
              _text={{ color: 'black', fontWeight: 'bold' }}
              size="lg"
              _pressed={{ bg: 'trueGray.400' }}
              _disabled={{ bg: 'trueGray.500' }}
              isDisabled={errors?.username}
              borderRadius="2xl"
              onPress={handleSubmit(onSendPressed)}
            >
              <FontAwesome
                name="send"
                size={24}
                color="black"
                style={{ padding: 2 }}
              >
                {' '}
                Send code
              </FontAwesome>
            </Button>
          </Flex>
        </VStack>
      </Flex>
    </KeyboardAvoidingView>
  );
}
