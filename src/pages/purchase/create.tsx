import React, {
  ChangeEvent, FormEvent, useContext, useEffect, useState,
} from 'react';
import {
  Button, ButtonGroup, chakra, Flex, Grid, useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Header from '../../components/UI/Header/Header';
import Form from '../../components/Form/Form';
import SEO from '../../components/SEO';
import BasicInput from '../../components/Login/BasicInput';
import PaymentModel from '../../serverless/data/models/PaymentModel';
import api from '../../services/fetchAPI/init';
import SearchBarDropdown from '../../components/Form/SearchBarDropdown';
import InfoOfSelecteds from '../../components/Form/InfoSelected';
import { validationField } from '../../utils/validations';
import toastConfig from '../../utils/config/tostConfig';
import ModalLoader from '../../components/UI/Loader/ModalLoader';
import PurchaseModel from '../../serverless/data/models/PurchaseModel';
import { AuthContext } from '../../context/AuthContext';
import AddPurchase, { AddPayment } from '../../serverless/data/usecases/AddPurchase';
import PragModal from '../../components/Layout/PragModal';
import InfoContainer from '../../components/Layout/InfoContainer';

export interface CreatePurchaseProps {
  data: {
    payments: PaymentModel[]
  }
}

const CreatePurchase = ({ data }: CreatePurchaseProps): JSX.Element => {
  const [description, setDescription] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string>('');
  const [userPayments, setUserPayments] = useState<PaymentModel[]>([]);
  const [paymentsSelecteds, setPaymentsSelecteds] = useState<PaymentModel[]>([]);
  const [payWith, setPayWith] = useState<AddPayment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notHasPayment, setNotHasPayment] = useState<boolean>(false);
  const toast = useToast();
  const { user } = useContext(AuthContext);

  const { push, back } = useRouter();

  useEffect(() => {
    if (Array.isArray(data) && data.length === 0) {
      setNotHasPayment(true);
    }
  }, []);

  const handleSearchDropboxChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.value === undefined || e.target.value === null || e.target.value === '' || !e.target.value) {
      setUserPayments([]);
      return;
    }

    setUserPayments((data.payments as PaymentModel[]).filter((payment) => payment.nickname.includes(e.target.value)));
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

  const handleValidations = (): boolean => {
    if (validationField(description) || validationField(purchaseDate)) {
      toast({
        title: '🤨',
        description: 'Todos os campos devem ser preenchidos.',
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return false;
    }

    if (payWith.length === 0) {
      toast({
        title: '🤨',
        description: 'Adicione uma forma de pagamento e o valor pago nela.',
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    const valueList = payWith.map((pay) => pay.value);
    const value = valueList.reduce((sumNumber, i) => sumNumber + i);
    const isValid = handleValidations();

    if (!isValid) {
      return;
    }

    const date = purchaseDate.split('T')[0];
    const year = Number(date.split('-')[0]);
    const month = Number(date.split('-')[1]);
    const day = Number(date.split('-')[2]);
    const setedDate = new Date(Date.UTC(year, month, day, 3, 0, 0));

    const purchase: PurchaseModel = {
      description,
      purchase_date: setedDate,
      user_id: user?.userInfo.id as number,
      value,
    };

    const addPurchase: AddPurchase = {
      ...purchase,
      payments: payWith,
    };
    const response = await api.post('/purchase/', addPurchase);

    if (response.data.error) {
      toast({
        title: '😢',
        description: response.data.error,
        status: 'error',
        ...toastConfig,
      });
    }

    if (response.data.message) {
      toast({
        title: '😎',
        description: response.data.message,
        status: 'success',
        ...toastConfig,
      });
    }

    setDescription('');
    setPayWith([]);
    setPaymentsSelecteds([]);
    setPurchaseDate('');
    setUserPayments([]);

    setIsLoading(false);
  };

  return (
    <>
      <SEO title="p.$ | Adicionar compra" description="Create purchase page" />
      <Header logo="Buy" />
      {isLoading && <ModalLoader isOpen={isLoading} />}
      {notHasPayment && (
      <PragModal isOpen={notHasPayment}>
        <InfoContainer
          action="Cadastrar pagamento"
          message="Por favor, cadastre uma forma de pagamento primeiro."
          handleAction={() => push('/payment/create', '/payment/create')}
        />
      </PragModal>
      )}
      <Flex
        flexDir="column"
        alignItems="center"
        padding="2em"
      >
        <Form handleSubmit={handleSubmit}>
          <chakra.h1 w="full" textAlign="center" fontWeight="bold" fontSize={{ base: '28px', md: '48px' }}>Adicionar Compra</chakra.h1>
          <Grid w="100%" templateRows="repeat(4, 0.5fr)" alignItems="center" gap={6}>
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
              inputValue={description}
            />
            <BasicInput
              id="date"
              label="Data de compra"
              type="date"
              onSetHandle={setPurchaseDate}
              placeholder=""
              inputValue={purchaseDate}
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
                fontSize={{ base: '20px', md: '24px' }}
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
                onClick={() => back()}
                bg="#D3D31A"
                fontSize={{ base: '20px', md: '24px' }}
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
  api.setAuthHeader(`Bearer ${authToken}`);
  const response = await api.get(`/user/payment/${userId}`);

  return {
    props: {
      data: response.data.content === undefined ? [] : response.data.content,
    },
  };
};
