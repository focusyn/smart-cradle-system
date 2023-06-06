import React from 'react';
import { Button } from 'native-base';

export default function AppButton(props) {
  return (
    <Button
      background="white"
      _text={{ color: 'black', fontWeight: 'bold' }}
      size="lg"
      _pressed={{ bg: 'trueGray.400' }}
      _disabled={{ bg: 'trueGray.400' }}
      borderRadius="2xl"
    >
      {props.children}
    </Button>
  );
}
