import { keyframes, Image } from '@chakra-ui/react';
import React from 'react';

const beat = keyframes`
  0% {
    transform: scale(.75);
  }
  20% {
    transform: scale(1);
  }
  40% {
    transform: scale(.75);
  }
  60% {
    transform: scale(1);
  }
  80% {
    transform: scale(.75);
  }
  100% {
    transform: scale(.75);
  }
`;

const animationBeat = `${beat} 1s infinite`;

const MoneyBeat = (): JSX.Element => (
  <Image display={{ base: 'none', md: 'block' }} src="/heart-with-dollar.svg" alt="Image Loading" width={{ base: '100%', md: '60%', xl: '30%' }} height={{ base: '100%', md: '60%', xl: '30%' }} animation={animationBeat} />
);

export default MoneyBeat;
