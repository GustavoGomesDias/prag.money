import React, { FormEvent, useState } from 'react';
import { Button, ButtonGroup, chakra, Flex, Grid, useToast } from '@chakra-ui/react';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import BasicInput from '../components/Login/BasicInput';
import Form from '../components/Login/Form/Form';
import Logo from '../components/Logo/Logo';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';
import { validateEmail, validationField } from '../utils/validations';
import toastConfig from '../utils/config/tostConfig';
import api from '../utils/config/api';

const Login = (): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { push } = useRouter();
  const toast = useToast();

  const handleRedirect = (path: string): void => {
    push(path, path);
  };


  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (validationField(email) || validationField(password)) {
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
      return;
    }
    

    const data = {
      email, password,
    }

    const response = await api.post('/user/login', data);

    if (response.data.payload) {
      console.log(response.data.payload);
      toast({
        title: 'Sucesso! 😎',
        description: 'Login efetuado com sucesso!',
        status: 'success',
        ...toastConfig,
      });
      return;
    }

    if (response.data.error) {
      toast({
        title: '😔',
        description: response.data.error,
        status: 'error',
        ...toastConfig,
      });
      return;
    }
  }

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
        <Form handleSubmit={handleSubmit}>
          <chakra.h1 w="full" textAlign="center" fontSize="48px">Entrar</chakra.h1>
          <Grid w="80%" templateRows="repeat(3, 1fr)" alignItems="center" gap={6}>
            <BasicInput id="email" label="E-mail" placeholder="example@example.com" onChangehandle={setEmail} />
            <BasicInput id="password" label="Senha" placeholder="************" type="password" onChangehandle={setPassword} />
            <ButtonGroup>
              <Button bg="#fff" fontSize="24px" border="2px #00735C solid" w="100%" h="60px" type="submit">Entrar</Button>
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
