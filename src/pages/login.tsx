import React, { FormEvent, useContext, useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { Button, ButtonGroup, chakra, Flex, Grid, useToast } from '@chakra-ui/react';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import BasicInput from '../components/Login/BasicInput';
import Form from '../components/Login/Form/Form';
import Logo from '../components/Logo/Logo';
import SEO from '../components/SEO';
import { validateEmail, validationField } from '../utils/validations';
import toastConfig from '../utils/config/tostConfig';
import api from '../services/api';
import ModalLoader from '../components/Loader/ModalLoader';
import { AuthContext } from '../context/AuthContext';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { parse } from 'node:path/win32';

const Login = (): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signIn, user } = useContext(AuthContext);

  const { push } = useRouter();
  const toast = useToast();

  const handleRedirect = (path: string): void => {
    push(path, path);
  };


  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    if (validationField(email) || validationField(password)) {
      toast({
        title: '🤨',
        description: 'Todos os campos devem ser preenchidos.',
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: '🤨',
        description: 'E-mail inválido.',
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }


    const data = {
      email, password,
    }

    await signIn(data);
    setIsLoading(false);
  }

  return (
    <>
      {isLoading && <ModalLoader isOpen={isLoading} />}
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
          <Logo fontSize="40px" logo={'Money'}  />
        </Flex>
        <Form handleSubmit={handleSubmit}>
          <chakra.h1 w="full" textAlign="center" fontSize="48px">Entrar</chakra.h1>
          <Grid w="80%" templateRows="repeat(3, 1fr)" alignItems="center" gap={6}>
            <BasicInput id="email" label="E-mail" placeholder="example@example.com" onChangehandle={setEmail} />
            <BasicInput id="password" label="Senha" placeholder="************" type="password" onChangehandle={setPassword} />
            <ButtonGroup
              flexDir="column"
              py="1em"
            >
              <Button
                bg="#fff"
                fontSize="24px"
                border="2px #00735C solid"
                w="100%"
                h="60px"
                type="submit"
              >
                Entrar
              </Button>
              <Button
                onClick={() => handleRedirect('/register')}
                bg="#00735C"
                fontSize="24px"
                color="#fff"
                w="100%"
                h="60px"
                mx="0px !important"
                mt="15px"
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { authToken } = parseCookies(ctx);
  if (authToken) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      }
    }
  }

  return {
    props: {},
  }
}
