import React, {
  ChangeEvent, FormEvent, useContext, useState,
} from 'react';
import {
  Button, ButtonGroup, chakra, Flex, Grid, useToast,
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
import InfoOfSelecteds from '../../components/Form/InfoSelected';
import { validationField } from '../../utils/validations';
import toastConfig from '../../utils/config/tostConfig';
import ModalLoader from '../../components/Loader/ModalLoader';
import PurchaseModel from '../../serverless/data/models/PurchaseModel';
import { AuthContext } from '../../context/AuthContext';

export interface CreatePurchaseProps {
  data: {
    payments: PaymentModel[]
  }
}

export interface AddPayWith {
  value: number
  paymentId: number
}

const CreatePurchase = ({ data }: CreatePurchaseProps): JSX.Element => {
  const [description, setDescription] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string>('');
  const [userPayments, setUserPayments] = useState<PaymentModel[]>([]);
  const [paymentsSelecteds, setPaymentsSelecteds] = useState<PaymentModel[]>([]);
  const [payWith, setPayWith] = useState<AddPayWith[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const { user } = useContext(AuthContext);

  const { push } = useRouter();

  const handleSearchDropboxChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.value === undefined || e.target.value === null || e.target.value === '' || !e.target.value) {
      setUserPayments([]);
      return;
    }
    setUserPayments(data.payments.filter((payment) => payment.nickname.includes(e.target.value)));
  };

  const handleSavePayWith = (e: ChangeEvent<HTMLInputElement>, paymentId: number) => {
    const paymentsId: number[] = payWith.map((item) => item.paymentId);

    if (paymentsId.length > 0) {
      const paymentIndex = paymentsId.indexOf(paymentId);
      if (paymentIndex < 0) {
        payWith.push({
          paymentId,
          value: Number(e.target.value),
        });
        setPayWith([...payWith]);
      } else {
        payWith[paymentIndex] = {
          paymentId: payWith[paymentIndex].paymentId,
          value: Number(e.target.value),
        };

        setPayWith([...payWith]);
      }
    } else {
      payWith.push({
        paymentId,
        value: Number(e.target.value),
      });
      setPayWith([...payWith]);
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    if (validationField(description) || validationField(purchaseDate)) {
      toast({
        title: '🤨',
        description: 'Todos os campos devem ser preenchidos.',
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }

    if (payWith.length === 0) {
      toast({
        title: '🤨',
        description: 'Adicione uma forma de pagamento e o valor pago nela.',
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }

    const valueList = payWith.map((pay) => pay.value);
    const value = valueList.reduce((sumNumber, i) => sumNumber + i);

    const purchase: PurchaseModel = {
      description,
      purchase_date: new Date(purchaseDate),
      user_id: user?.userInfo.id as number,
      value,
    };

    console.log(purchase);
    setIsLoading(false);
  };

  return (
    <>
      <SEO title="p.$ | Adicionar compra" description="Create purchase page" />
      <Header logo="Buy" />
      {isLoading && <ModalLoader isOpen={isLoading} />}
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
            <BasicInput
              id="description"
              label="Descrição da compra:"
              placeholder="Almoço nas Bahamas"
              onSetHandle={setDescription}
            />
            <BasicInput
              id="date"
              label="Data de compra"
              type="date"
              onSetHandle={setPurchaseDate}
              placeholder=""
            />
            {paymentsSelecteds.length > 0 && paymentsSelecteds.map((payment) => (
              <Flex
                key={payment.nickname}
                flexDir="column"
                border="1px solid #00735C"
                borderRadius="5px"
              >
                <InfoOfSelecteds
                  renderButton={false}
                  payment={payment}
                />
                <BasicInput
                  id="value"
                  label="Valor de compra (R$):"
                  placeholder="800,00"
                  type="number"
                  step="any"
                  paymentId={payment.id}
                  onChangeHandlePayWith={handleSavePayWith}
                />
              </Flex>
            ))}
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
