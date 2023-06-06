import {
  Flex,
  VStack,
  KeyboardAvoidingView,
  Input,
  Button,
  Text,
} from 'native-base';
import AppHeading from '../../../components/AppHeading';
import AppBrand from '../../../components/AppBrand';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';

export default function Username() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      username: '',
    },
  });

  const handleSubmitForm = (data) => {
    router.push({
      pathname: '/auth/signup/emailAddress',
      params: {
        name: data.name,
        username: data.username,
      },
    });
  };
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
          <AppBrand></AppBrand>
          <AppHeading>Let's get started, what's your name?</AppHeading>

          <Controller
            control={control}
            rules={{
              required: 'Name is required',
              minLength: {
                value: 3,
                message: 'Name should be at least 3 characters long',
              },
              maxLength: {
                value: 24,
                message: 'Name should be max 24 characters long',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Input
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
                  placeholder="Name"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  autoFocus
                />
                {errors?.name && (
                  <Text color={'trueGray.400'}>
                    {errors?.name?.message || 'Invalid name'}
                  </Text>
                )}
              </>
            )}
            name="name"
          />

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
          <Button
            background="white"
            _text={{ color: 'black', fontWeight: 'bold' }}
            size="lg"
            _pressed={{ bg: 'trueGray.400' }}
            _disabled={{ bg: 'trueGray.500' }}
            isDisabled={errors?.name || errors?.username}
            borderRadius="2xl"
            onPress={handleSubmit(handleSubmitForm)}
          >
            Continue
          </Button>
        </VStack>
      </Flex>
    </KeyboardAvoidingView>
  );
}
