import React, {
  ChangeEvent, FormEvent, useState,
} from 'react';
import {
  Button, ButtonGroup, chakra, Flex, Grid,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Header from '../../components/Header/Header';
import Form from '../../components/Form/Form';
import SEO from '../../components/SEO';
import BasicInput from '../../components/Login/BasicInput';
import PaymentModel from '../../serverless/data/models/PaymentModel';
import api from '../../services/fetchAPI/init';
import SearchBarDropdown from '../../components/Form/SearchBarDropdown';

export interface CreatePurchaseProps {
  data: {
    payments: PaymentModel[]
  }
}

const CreatePurchase = ({ data }: CreatePurchaseProps): JSX.Element => {
  const [value, setValue] = useState<number>(-1);
  const [description, setDescription] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string>('');
  const [userPayments, setUserPayments] = useState<PaymentModel[]>([]);
  const [paymentsSelecteds, setPaymentsSelecteds] = useState<PaymentModel[]>([]);

  const { push } = useRouter();

  const handleSearchDropboxChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.value === undefined || e.target.value === null || e.target.value === '' || !e.target.value) {
      setUserPayments([]);
      return;
    }
    setUserPayments(data.payments.filter((payment) => payment.nickname.includes(e.target.value)));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    console.log(value, description, purchaseDate);
    console.log(1);
  };
  return (
    <>
      <SEO title="p.$ | Adicionar compra" description="Create purchase page" />
      <Header logo="Buy" />
      <Flex
        flexDir="column"
        alignItems="center"
        padding="2em"
      >
        <Form handleSubmit={handleSubmit}>
          <chakra.h1 w="full" textAlign="center" fontSize="48px">Adicionar Compra</chakra.h1>
          <Grid w="80%" templateRows="repeat(4, 0.5fr)" alignItems="center" gap={6}>
            <SearchBarDropdown
              payments={userPayments}
              hanldeSearchPayment={handleSearchDropboxChange}
              paymentsSelecteds={paymentsSelecteds}
              setPaymentsSelecteds={setPaymentsSelecteds}
            />
            <BasicInput id="value" label="Valor de compra (R$):" placeholder="800,00" type="number" step="any" onSetHandle={setValue} />
            <BasicInput id="description" label="Descrição da compra:" placeholder="Almoço nas Bahamas" onSetHandle={setDescription} />
            <BasicInput id="date" label="Data de compra" type="date" onSetHandle={setPurchaseDate} placeholder="" />
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
                onClick={() => push('/dashboard', '/dashboard')}
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

export default CreatePurchase;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { authToken, userId } = parseCookies(ctx);

  if (!authToken || userId === undefined || !userId) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const { data } = await api.get(`/user/payment/${userId}`);

  return {
    props: {
      data: data.content,
    },
  };
};
