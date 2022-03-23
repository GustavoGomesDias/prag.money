import {
  Button, ButtonGroup, chakra, Flex, Grid, useToast,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import React, { FormEvent, useContext, useState } from 'react';
import Header from '../../components/UI/Header/Header';
import ModalLoader from '../../components/UI/Loader/ModalLoader';
import BasicInput from '../../components/Login/BasicInput';
import Form from '../../components/Form/Form';
import SEO from '../../components/SEO';
import { AuthContext } from '../../context/AuthContext';
import PaymentModel from '../../serverless/data/models/PaymentModel';
import api from '../../services/fetchAPI/init';
import toastConfig from '../../utils/config/tostConfig';
import { validationDay, validationField } from '../../utils/validations';

const Create = (): JSX.Element => {
  const [nickname, setNickName] = useState<string>('');
  const [defaultValue, setDefaultValue] = useState<number>(-1);
  const [resetDay, setResetDay] = useState<string>('0');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useContext(AuthContext);

  const { push } = useRouter();
  const toast = useToast();

  const handleRedirect = (path: string): void => {
    push(path, path);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    if (validationField(nickname) || defaultValue === -1) {
      toast({
        title: '🤨',
        description: 'Todos os campos devem ser preenchidos.',
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }

    if (!validationDay(Number(resetDay))) {
      toast({
        title: '🤨',
        description: 'Por favor, forneça uma data que seja valida.',
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }

    if (user === undefined) {
      toast({
        title: '🤨',
        description: 'Necessário login!',
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }

    const data: PaymentModel = {
      nickname, default_value: Number(defaultValue), reset_day: Number(resetDay), user_id: (user?.userInfo.id as number),
    };
    const response = await api.post('/payment/register', data);
    if (response.data.message) {
      toast({
        title: 'Sucesso! 😎',
        description: response.data.message,
        status: 'success',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }

    if (response.data.error) {
      toast({
        title: '😔',
        description: response.data.error,
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  return (
    <>
      <SEO title="p.$ | Adicionar Forma de Pagamento" description="Create payment page" />
      <Header logo="Pay" />
      {isLoading && <ModalLoader isOpen={isLoading} />}
      <Flex
        flexDir="column"
        alignItems="center"
        padding="2em"
      >
        <Form handleSubmit={handleSubmit}>
          <chakra.h1 w="full" textAlign="center" fontSize="48px">Adicionar Forma de Pagamento</chakra.h1>
          <Grid w="80%" templateRows="repeat(3, 1fr)" alignItems="center" gap={6}>
            <BasicInput id="nickname" label="Apelido" placeholder="bitcoin wallet" onSetHandle={setNickName} />
            <BasicInput id="defaultValue" label="Valor padrão" type="number" step="any" placeholder="800,00" onSetHandle={setDefaultValue} />
            <BasicInput id="resetDate" label="Data de reset" type="number" min="1" max="31" onSetHandle={setResetDay} placeholder="" />
            <ButtonGroup
              flexDir="column"
              py="1em"
            >
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
                type="submit"
              >
                Salvar
              </Button>
              <Button
                onClick={() => handleRedirect('/dashboard')}
                bg="#D3D31A"
                fontSize="24px"
                color="#fff"
                w="100%"
                h="60px"
                mx="0px !important"
                mt="15px"
                _hover={{
                  bg: '#ECEC11',
                }}
              >
                Voltar
              </Button>
            </ButtonGroup>
          </Grid>
        </Form>
      </Flex>
    </>
  );
};

export default Create;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { authToken } = parseCookies(ctx);

  if (!authToken || authToken === undefined || authToken === null) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
