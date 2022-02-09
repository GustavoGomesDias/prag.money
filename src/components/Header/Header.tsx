import React from 'react';
import { useRouter } from 'next/router';
import { Button, ButtonGroup, chakra, Flex, Link } from '@chakra-ui/react';

import Logo from '../Logo/Logo';


const Header = (): JSX.Element => {
  const { push } = useRouter();

  const handleRedirect = (path: string): void => {
    push(path, path);
  };

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
          <Button onClick={() => handleRedirect('/register')} colorScheme='teal' size="lg" variant='outline' fontWeight="bold">
            Cadastre-se
          </Button>
          <Button onClick={() => handleRedirect('/login')} colorScheme='teal' size="lg" variant='outline' fontWeight="bold">
            Login
          </Button>
        </ButtonGroup>
      </Flex>
    </chakra.header>
  );
}

export default Header;