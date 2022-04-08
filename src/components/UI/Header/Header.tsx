import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import {
  ButtonGroup, chakra, Flex,
} from '@chakra-ui/react';

import Logo from '../Logo/Logo';
import { AuthContext } from '../../../context/AuthContext';
import CustomButton from '../CustomButton';

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

  const login = (): void => {
    push('/login', '/login');
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
            <CustomButton action="Sair" handleOnClick={logout} />
          ) : (
            <CustomButton action="Login" handleOnClick={login} />
          )}

        </ButtonGroup>
      </Flex>
    </chakra.header>
  );
};

export default Header;