import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

export interface PaymentMethodCardProps {
  children: JSX.Element | JSX.Element[]
  title: string
}

const PaymentMethodCard = ({ children, title }: PaymentMethodCardProps): JSX.Element => (
  <Flex
    pb="0.5em"
    px="0.5em"
    width={{ base: '100%', md: '300px', xl: '300px' }}
    height="120px"
    alignItems="center"
    justifyContent="center"
    bg="#0e2e50"
    borderRadius="5px"
    borderLeft="5px solid #00735C"
    boxShadow="0 0 1em rgba(0, 0, 0, 0.6)"
    flexDir="column"
    fontWeight="bold"
    color="#06866c"
    transition="0.5s ease"
    _hover={{
      color: '#00E091',
      bg: '#012440',
    }}
  >
    <Text h="80%" w="100%">{title}</Text>
    <Flex
      width="100%"
      alignItems="center"
      justifyContent="center"
      h="80%"
    >
      {children}
    </Flex>
  </Flex>
);

export default PaymentMethodCard;
