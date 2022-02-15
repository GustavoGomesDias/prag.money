import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { Button, ButtonGroup, chakra, Flex, Link } from '@chakra-ui/react';

import Logo from '../Logo/Logo';
import { AuthContext } from '../../context/AuthContext';

export interface HeaderProps {
  logo: string
}

const Header = ({ logo }: HeaderProps): JSX.Element => {
  const { push } = useRouter();
  const { user } = useContext(AuthContext);

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
        <Logo fontSize="64px" logo={logo} />
        <ButtonGroup display="flex" alignItems="center">
          {user?.userInfo !== undefined ? (
            <Button onClick={() => handleRedirect('/register')} colorScheme='teal' size="lg" variant='outline' fontWeight="bold">
              Sair
            </Button>
          ) : (
            <>
              <Button onClick={() => handleRedirect('/register')} colorScheme='teal' size="lg" variant='outline' fontWeight="bold">
                Cadastre-se
              </Button><Button onClick={() => handleRedirect('/login')} colorScheme='teal' size="lg" variant='outline' fontWeight="bold">
                Login
              </Button>
            </>
          )}

        </ButtonGroup>
      </Flex>
    </chakra.header>
  );
}

export default Header;
