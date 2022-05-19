import React from 'react';
import {
  Flex, Text, keyframes, Icon,
} from '@chakra-ui/react';
import { FiAlertOctagon } from 'react-icons/fi';
import Logo from '../UI/Logo/Logo';
import CustomButton from '../UI/Buttons/CustomButton';

export interface InfoContainerProps {
  message: string
  firstAction: string
  secondAction: string
  handleFirstAction: (() => void) | (() => Promise<void>)
  handleSecondAction: (() => void) | (() => Promise<void>)
  handleCancel: () => void
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

const ManagerContainer = ({
  firstAction, secondAction, handleFirstAction, handleSecondAction, message, handleCancel,
}: InfoContainerProps): JSX.Element => (
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
      <Icon animation={animationSpin} w={{ base: '120px', md: '150px' }} color="salmon" h={{ base: '120px', md: '150px' }} as={FiAlertOctagon} />
      <Text
        fontSize={{ base: '20px', md: '28px' }}
        textAlign="center"
        color="#fff"
      >
        {message}
      </Text>
      <Flex
        flexDir="column"
        w="100%"
      >
        <Flex
          width="100%"
          flexDir="column"
        >
          <CustomButton hoverColor="#FA8072" action={firstAction} handleOnClick={handleFirstAction} />
          <CustomButton hoverColor="#FA8072" action={secondAction} handleOnClick={handleSecondAction} />
          <CustomButton action="Cancelar" handleOnClick={handleCancel} />
        </Flex>
      </Flex>
    </Flex>
  </>
);

export default ManagerContainer;
