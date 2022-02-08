import React from 'react';
import { Button, ButtonGroup, chakra, Flex, Link } from '@chakra-ui/react';

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
          <Link href="/register">
            <Button colorScheme='teal' size="lg" variant='outline' fontWeight="bold">
              Cadastre-se
            </Button>
          </Link>
          <Link href="/login">
            <Button colorScheme='teal' size="lg" variant='outline' fontWeight="bold">
              Login
            </Button>
          </Link>
        </ButtonGroup>
      </Flex>
    </chakra.header>
  );
}

export default Header;