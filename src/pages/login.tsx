import React, {
  FormEvent, useContext, useState,
} from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Button, ButtonGroup, chakra, Flex, Grid, useToast,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import BasicInput from '../components/Login/BasicInput';
import Form from '../components/Form/Form';
import SEO from '../components/SEO';
import { validateEmail, validationField } from '../utils/validations';
import toastConfig from '../utils/config/tostConfig';
import ModalLoader from '../components/Loader/ModalLoader';
import { AuthContext } from '../context/AuthContext';
import FormHeader from '../components/Form/FormHeader';

const Login = (): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signIn } = useContext(AuthContext);

  const { push } = useRouter();
  const toast = useToast();

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
    };

    const result = await signIn(data);
    setIsLoading(false);
    if (!result) {
      toast({
        title: '😔',
        description: 'Não foi possível fazer login. Verifique se e-mail ou senha estão errados',
        status: 'error',
        ...toastConfig,
      });
    } else {
      toast({
        title: '👏',
        description: 'Login efetuado com sucesso!',
        status: 'success',
        ...toastConfig,
      });
      push('/dashboard', '/dashboard');
    }
  };

  return (
    <>
      {isLoading && <ModalLoader isOpen={isLoading} />}
      <SEO title="p.$_ | Login de usuário" description="User login page" />
      <Flex
        flexDir="column"
        alignItems="center"
      >
        <FormHeader />
        <Form handleSubmit={handleSubmit}>
          <chakra.h1 w="full" textAlign="center" fontSize="48px">Entrar</chakra.h1>
          <Grid w="80%" templateRows="repeat(3, 1fr)" alignItems="center" gap={6}>
            <BasicInput id="email" label="E-mail" placeholder="example@example.com" onSetHandle={setEmail} />
            <BasicInput id="password" label="Senha" placeholder="************" type="password" onSetHandle={setPassword} />
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
              <Link href="/register" passHref>
                <Button
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
              </Link>
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
      },
    };
  }

  return {
    props: {},
  };
};
