import React from 'react';
import {
  Flex, Text, keyframes, Icon,
} from '@chakra-ui/react';
import { FiAlertOctagon } from 'react-icons/fi';
import Logo from '../UI/Logo/Logo';
import CustomButton from '../UI/Buttons/CustomButton';

export interface InfoConainerProps {
  message: string
  action: string
  handleAction: () => void
}

const animationFlexKeyFrames = keyframes`
  0% { width: 0; }
  100% { width: 60%; }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const animation = `${animationFlexKeyFrames} 0.5s ease-in-out`;
const animationSpin = `${spin} 1s ease-in-out`;

const InfoConainer = ({ action, handleAction, message }: InfoConainerProps): JSX.Element => (
  <>
    <Logo fontSize="2.5em" logo="Money" />
    <Flex
      animation={animation}
      flexDir="column"
      justifyContent="space-evenly"
      alignItems="center"
      borderRadius="5px"
      width="60%"
      bg="#00735C"
      h="600px"
      p="1em"
    >
      <Icon animation={animationSpin} w="150px" color="salmon" h="150px" as={FiAlertOctagon} />
      <Text
        fontSize="28px"
        textAlign="center"
        color="#fff"
      >
        {message}
      </Text>
      <CustomButton action={action} handleOnClick={handleAction} />
    </Flex>
  </>
);

export default InfoConainer;
