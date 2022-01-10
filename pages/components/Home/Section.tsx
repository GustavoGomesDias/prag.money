import React from 'react';
import { Flex, Box, chakra } from '@chakra-ui/react';
import { FaMoneyBillWaveAlt, FaCreditCard, FaTshirt, FaHamburger, FaMobile } from 'react-icons/fa';

const Section = (): JSX.Element => {
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      padding="5em"
    >
      <Flex
        flexDir="column"
        justifyContent="center"
        alginItems="center"
      >
        <Flex justifyContent="center">
          <FaMoneyBillWaveAlt size="60px" style={{ marginRight: '15px' }} />
          <FaCreditCard size="60px" />
        </Flex>
          <chakra.h3 fontSize="36px" textAlign="center">Cadastre várias formas de pagamento</chakra.h3>
      </Flex>
      <chakra.h3 fontSize="36px" textAlign="center" fontWeight="bold">e</chakra.h3>
      <Flex
        flexDir="column"
        justifyContent="center"
        alginItems="center"
      >
        <Flex justifyContent="center">
          <FaTshirt size="60px" style={{ marginRight: '15px' }}/>
          <FaHamburger size="60px" style={{ marginRight: '15px' }}/>
          <FaMobile size="60px" />
        </Flex>
          <chakra.h3 fontSize="36px" textAlign="center">Use-as para trackear suas compras</chakra.h3>
      </Flex>
    </Flex>
  );
}

export default Section;
