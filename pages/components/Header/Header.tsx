import React from 'react';
import { Button, ButtonGroup, chakra, Flex } from '@chakra-ui/react';

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
        <ButtonGroup display="flex" alignItems="center">
          <Button colorScheme='teal' size="lg" variant='outline' fontWeight="bold">
            Cadastre-se
          </Button>
          <Button colorScheme='teal' size="lg" variant='outline' fontWeight="bold">
            Login
          </Button>
        </ButtonGroup>
      </Flex>
    </chakra.header>
  );
}

export default Header;