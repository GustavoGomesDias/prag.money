import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, ButtonGroup, chakra, Flex, Grid, useToast } from '@chakra-ui/react';
import { FaLongArrowAltLeft } from 'react-icons/fa';

import BasicInput from '../components/Login/BasicInput';
import Form from '../components/Login/Form/Form';
import Logo from '../components/Logo/Logo';
import { validateEmail, validationField } from '../utils/validations';
import toastConfig from '../utils/config/tostConfig';
import api from '../utils/config/api';

const Register = (): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  
  const { push } = useRouter();
  const toast = useToast();

  const handleRedirect = (path: string): void => {
    push(path, path);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (validationField(email) || validationField(name) || validationField(password) || validationField(passwordConfirmation)) {
      toast({
        title: '🤨',
        description: 'Todos os campos devem ser preenchidos.',
        status: 'error',
        ...toastConfig,
      });
    }

    if (!validateEmail(email)) {
      toast({
        title: '🤨',
        description: 'E-mail inválido.',
        status: 'error',
        ...toastConfig,
      });

      if (password.length < 6 || passwordConfirmation.length < 6) {
        toast({
          title: '🤨',
          description: 'A senha deve ter pelo menos 6 caracteres',
          status: 'error',
          ...toastConfig,
        });
      }

      if (password !== passwordConfirmation) {
        toast({
          title: '🤨',
          description: 'Confirmar senha não corresponde a Senha.',
          status: 'error',
          ...toastConfig,
        });
      }
    }


    const data = { name, email, password, passwordConfirmation };
    const response= await api.post('/user/register', data);

    console.log(response);

    if (response.data.message) {
      toast({
        title: 'Sucesso! 😎',
        description: response.data.message,
        status: 'success',
        ...toastConfig,
      });
    }

    if (response.data.error) {
      toast({
        title: '😔',
        description: response.data.error,
        status: 'error',
        ...toastConfig,
      });
    }
  }

  return (
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
        <chakra.h1 w="full" textAlign="center" fontSize="48px">Cadastre-se</chakra.h1>
        <Grid w="80%" templateRows="repeat(3, 1fr)" alignItems="center" gap={6}>
          <BasicInput id="name" label="Nome" placeholder="Seu nome completo aqui" onChangehandle={setName} />
          <BasicInput id="email" label="E-mail" placeholder="example@example.com" onChangehandle={setEmail} />
          <BasicInput id="password" label="Senha" placeholder="************" type="password" onChangehandle={setPassword} />
          <BasicInput id="confirmPass" label="Confirmar senha" placeholder="************" type="password" onChangehandle={setPasswordConfirmation} />
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
  );
};

export default Register;
