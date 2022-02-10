import React, { FormEvent } from 'react';
import { Button, ButtonGroup, chakra, Flex, Grid } from '@chakra-ui/react';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import BasicInput from '../components/Login/BasicInput';
import Form from '../components/Login/Form/Form';
import Logo from '../components/Logo/Logo';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';

const Login = (): JSX.Element => {
  const { push } = useRouter();

  const handleRedirect = (path: string): void => {
    push(path, path);
  };

  return (
    <>
      <SEO title='p.$_ | Login de usuário' description='User login page' />
      <Flex
        flexDir="column"
        alignItems="center"
      >
        <Flex
          justifyContent="space-between"
          w="full"
          px="1em"
          py="3em"
        >
          <Button onClick={() => handleRedirect('/')} variant="link" color="#00735C" fontSize="26px"> <FaLongArrowAltLeft />Voltar</Button>
          <Logo fontSize="40px" />
        </Flex>
        <Form handleSubmit={function (e: FormEvent<Element>): Promise<void> {
          throw new Error('Function not implemented.');
        }}>
          <chakra.h1 w="full" textAlign="center" fontSize="48px">Entrar</chakra.h1>
          <Grid w="80%" templateRows="repeat(3, 1fr)" alignItems="center" gap={6}>
            <BasicInput id="email" label="E-mail" placeholder="example@example.com" onChangehandle={undefined} />
            <BasicInput id="password" label="Senha" placeholder="************" type="password" onChangehandle={undefined} />
            <ButtonGroup>
              <Button bg="#fff" fontSize="24px" border="2px #00735C solid" w="100%" h="60px">Entrar</Button>
              <Button
                onClick={() => handleRedirect('/register')}
                bg="#00735C"
                fontSize="24px"
                color="#fff"
                w="100%"
                h="60px"
                _hover={{
                  bg: '#00E091',
                }}
              >
                Cadastre-se
              </Button>
            </ButtonGroup>
          </Grid>
        </Form>
      </Flex>
    </>
  );
};

export default Login;
