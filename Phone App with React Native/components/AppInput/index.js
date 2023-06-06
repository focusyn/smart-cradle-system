import React from 'react';
import { Input } from 'native-base';

export default function AppInput(props) {
  return (
    <Input
      fontSize={35}
      paddingLeft="0"
      fontWeight="bold"
      borderWidth={0}
      borderRadius="3xl"
      placeholderTextColor={'trueGray.600'}
      _focus={{
        bg: 'black',
        selectionColor: 'white',
        color: 'white',
        paddingX: 5,
      }}
    >
      {props.children}
    </Input>
  );
}
