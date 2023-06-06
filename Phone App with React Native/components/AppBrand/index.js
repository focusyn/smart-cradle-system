import React from 'react';
import { Center } from 'native-base';
import { Image } from 'react-native';

export default function AppBrand() {
  return (
    <Center marginY={20}>
      <Image
        source={require('../../assets/logo.png')}
        style={{
          height: 50,
          width: 200,
        }}
      />
    </Center>
  );
}
