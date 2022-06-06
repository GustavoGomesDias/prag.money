import { Flex } from '@chakra-ui/react';
import React from 'react';

export interface PaymentMethodCardProps {
  children: JSX.Element | JSX.Element[]
}

const PaymentMethodCard = ({ children }: PaymentMethodCardProps): JSX.Element => (
  <Flex
    padding="0.8em"
    width={{ base: '100%', md: '320px', xl: '400px' }}
    height="120px"
    alignItems="center"
    justifyContent="center"
    bg="#0e2e50"
    borderRadius="5px"
    borderLeft="5px solid #00735C"
    boxShadow="0 0 1em rgba(0, 0, 0, 0.6)"
  >
    {children}
  </Flex>
);

export default PaymentMethodCard;
