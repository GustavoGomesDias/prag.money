import React from 'react';
import { chakra, Flex } from '@chakra-ui/react';

import Logo from '../Logo/Logo';


const Header = (): JSX.Element => {
  return (
    <chakra.header
      bg="#fff"
      position="sticky"
      w="full"
      px={{ base: 2, sm: 4 }}
    >

      <Flex
        justifyContent="space-between"
      >
        <Logo fontSize="64px" />
      </Flex>
    </chakra.header>
  );
}

export default Header;