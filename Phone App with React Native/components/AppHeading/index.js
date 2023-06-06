import React from 'react';
import { Heading } from 'native-base';

export default function AppHeading(props) {
  return (
    <Heading color="white" fontSize={30} marginBottom={5}>
      {props.children}
    </Heading>
  );
}
