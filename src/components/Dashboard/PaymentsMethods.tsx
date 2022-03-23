import React from 'react';
import { Flex, Select } from '@chakra-ui/react';

const PaymentsMethods = (): JSX.Element => {
  console.log('nada não');
  return (
    <Flex
      width="100%"
      justifyContent="flex-end"
      padding="1em"
    >
      <Flex
        width="30%"
        padding="0.8em"
        alignItems="center"
        justifyContent="center"
        bg="#fff"
        borderRadius="5px"
        border="2px solid #00735C"
      >
        <Select
          variant="outline"
          placeholder="Select option"
          width="50%"
          height="2.5em"
          mr="15px"
          bg="#fff"
          borderRadius="5px"
          border="2px solid #00735C"
          borderColor="initial"
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select>
        Saldo: R$ 0000,00
      </Flex>
    </Flex>
  );
};

export default PaymentsMethods;
