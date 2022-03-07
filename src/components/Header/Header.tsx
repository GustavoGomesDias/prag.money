import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import {
  Button, ButtonGroup, chakra, Flex,
} from '@chakra-ui/react';

import Link from 'next/link';
import Logo from '../Logo/Logo';
import { AuthContext } from '../../context/AuthContext';

export interface HeaderProps {
  logo: string
}

const Header = ({ logo }: HeaderProps): JSX.Element => {
  const { push } = useRouter();
  const { user, signOut } = useContext(AuthContext);

  const logout = (): void => {
    signOut();
    push('/', '/');
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
            <Button onClick={() => logout()} colorScheme="teal" size="lg" variant="outline" fontWeight="bold">
              Sair
            </Button>
          ) : (
            <>
              <Link href="/register" passHref>
                <Button colorScheme="teal" size="lg" variant="outline" fontWeight="bold">
                  Cadastre-se
                </Button>
              </Link>
              <Link href="/login" passHref>
                <Button colorScheme="teal" size="lg" variant="outline" fontWeight="bold">
                  Login
                </Button>
              </Link>
            </>
          )}

        </ButtonGroup>
      </Flex>
    </chakra.header>
  );
};

export default Header;
