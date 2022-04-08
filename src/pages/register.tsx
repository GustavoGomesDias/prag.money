import React, {
  FormEvent, useState,
} from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import {
  Button, ButtonGroup, chakra, Flex, Grid, useToast,
} from '@chakra-ui/react';

import BasicInput from '../components/Login/BasicInput';
import Form from '../components/Form/Form';
import { validateEmail, validationField } from '../utils/validations';
import toastConfig from '../utils/config/tostConfig';
import SEO from '../components/SEO';
import ModalLoader from '../components/UI/Loader/ModalLoader';
import api from '../services/fetchAPI/init';
import FormHeader from '../components/Form/FormHeader';

const Register = (): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { push } = useRouter();
  const toast = useToast();

  const handleRedirect = (path: string): void => {
    push(path, path);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    if (validationField(email) || validationField(name) || validationField(password) || validationField(passwordConfirmation)) {
      toast({
        title: '🤨',
        description: 'Todos os campos devem ser preenchidos.',
        status: 'error',
        ...toastConfig,
      });
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

    if (password.length < 6 || passwordConfirmation.length < 6) {
      toast({
        title: '🤨',
        description: 'A senha deve ter pelo menos 6 caracteres',
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }

    if (password !== passwordConfirmation) {
      toast({
        title: '🤨',
        description: 'Confirmar senha não corresponde a Senha.',
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }

    const data = {
      name, email, password, passwordConfirmation,
    };

    const response = await api.post('/user/register', data);

    if (response.data.message) {
      toast({
        title: 'Sucesso! 😎',
        description: response.data.message,
        status: 'success',
        ...toastConfig,
      });
      setIsLoading(false);
      push('/login', '/login');
      return;
    }

    if (response.data.error) {
      toast({
        title: '😔',
        description: response.data.error,
        status: 'error',
        ...toastConfig,
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <ModalLoader isOpen={isLoading} />}
      <SEO title="p.$_ | Cadastro de usuário" description="User registrer page" />
      <Flex
        flexDir="column"
        alignItems="center"
        pb="2em"
      >
        <FormHeader />
        <Form handleSubmit={handleSubmit}>
          <chakra.h1 w="full" textAlign="center" fontSize="48px">Cadastre-se</chakra.h1>
          <Grid w="80%" templateRows="repeat(3, 1fr)" alignItems="center" gap={6}>
            <BasicInput id="name" label="Nome" placeholder="Seu nome completo aqui" onSetHandle={setName} />
            <BasicInput id="email" label="E-mail" placeholder="example@example.com" onSetHandle={setEmail} />
            <BasicInput id="password" label="Senha" placeholder="************" type="password" onSetHandle={setPassword} />
            <BasicInput id="confirmPass" label="Confirmar senha" placeholder="************" type="password" onSetHandle={setPasswordConfirmation} />
            <ButtonGroup py="1em" flexDir="column">
              <Button
                bg="#00735C"
                fontSize="24px"
                color="#fff"
                w="100%"
                h="60px"
                _hover={{
                  bg: '#00E091',
                }}
                type="submit"
              >
                Cadastrar-se
              </Button>
              <Button onClick={() => handleRedirect('/login')} variant="link" fontSize="18px" mt="5px" color="#00735C" w="100%" h="60px">Já tem cadastro? Então faça login</Button>
            </ButtonGroup>
          </Grid>
        </Form>
      </Flex>
    </>
  );
};

export default Register;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { authToken } = parseCookies(ctx);

  if (authToken) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
