import React, { FormEvent } from 'react';
import { useRouter } from 'next/router';
import { Button, ButtonGroup, chakra, Flex, Grid } from '@chakra-ui/react';
import { FaLongArrowAltLeft } from 'react-icons/fa';

import BasicInput from './components/Login/BasicInput';
import Form from './components/Login/Form/Form';
import Logo from './components/Logo/Logo';

const Register = (): JSX.Element => {
  const { push } = useRouter();

  const handleRedirect = (path: string): void => {
    push(path, path);
  };

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
      <Form handleSubmit={function (e: FormEvent<Element>): Promise<void> {
        throw new Error('Function not implemented.');
      }}>
        <chakra.h1 w="full" textAlign="center" fontSize="48px">Cadastre-se</chakra.h1>
        <Grid w="80%" templateRows="repeat(3, 1fr)" alignItems="center" gap={6}>
          <BasicInput id="email" label="E-mail" placeholder="example@example.com" onChangehandle={undefined} />
          <BasicInput id="password" label="Senha" placeholder="************" type="password" onChangehandle={undefined} />
          <BasicInput id="confirmPass" label="Confirmar senha" placeholder="************" type="password" onChangehandle={undefined} />
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
