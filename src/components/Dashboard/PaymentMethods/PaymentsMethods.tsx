/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, ChangeEvent, useContext, MouseEvent, useEffect,
} from 'react';
import {
  Flex, Select, Text, useToast, Grid, GridItem,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { parseCookies } from 'nookies';
import PurchaseContext from '../../../context/purchases/PurchaseContext';
import PaymentModel from '../../../serverless/data/models/PaymentModel';
import api from '../../../services/fetchAPI/init';
import toastConfig from '../../../utils/config/tostConfig';
import PragModal from '../../Layout/PragModal';
import ManagerContainer from '../../Layout/ManagerContainer';
import ModalLoader from '../../UI/Loader/ModalLoader';
import PaymentContext from '../../../context/payment/PaymentContext';
import PaymentMethodCard from './PaymentMethodCard';
import PaymentActions from './PaymentActions';
import AddAdditonalValue from './AddAdditionalValue';
import AddAdditionalValue from '../../../serverless/data/usecases/AddAdditionalValue';

export interface PaymentsMethodsProps {
  refresh(): Promise<void>
}

const PaymentsMethods = ({ refresh }: PaymentsMethodsProps): JSX.Element => {
  const purchaseCtx = useContext(PurchaseContext);
  const { payments } = useContext(PaymentContext);

  const [balance, setBalance] = useState<number>(0);
  const [paymentId, setPaymentId] = useState<number>(0);
  const [paymentList, setPaymentList] = useState<PaymentModel[] | undefined>(payments);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [additionalValue, setAdditionalValue] = useState<number>(-1);
  const [renderAdditionalValueForm, setRenderAdditionalValueForm] = useState<boolean>(false);

  const { push } = useRouter();

  const toast = useToast();

  useEffect(() => {
    if (paymentId === 0) {
      purchaseCtx.handleClearPurchaseList();
    }

    if (paymentList !== undefined) setPaymentList([...paymentList]);
  }, [paymentId]);

  useEffect(() => {
    if (payments !== undefined) setPaymentList([...payments]);
  }, [payments]);

  const handleOnSelect = async (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    if (payments === undefined) {
      return;
    }

    if (Number(e.target.value) === 0) {
      setPaymentId(0);
      setBalance(0);
      purchaseCtx.handleClearPurchaseList();
      return;
    }

    if (paymentId === 0 || paymentId === Number(e.target.value)) {
      const paymentsIds = payments.map((payment) => payment.id);

      const selectedPaymentIndex: number = paymentsIds.indexOf(Number(e.target.value));
      const { current_value } = payments[selectedPaymentIndex];

      if (current_value) {
        setBalance(Number(current_value));
      }

      await purchaseCtx.handleGetPurchasesByPaymentId(Number(e.target.value));
      setPaymentId(Number(e.target.value));
      return;
    }

    const paymentsIds = payments.map((payment) => payment.id);

    const selectedPaymentIndex: number = paymentsIds.indexOf(Number(e.target.value));
    const { current_value } = payments[selectedPaymentIndex];
    if (current_value) {
      setBalance(Number(current_value));
    }

    purchaseCtx.handleClearPurchaseList();
    await purchaseCtx.handleGetPurchasesByPaymentId(Number(e.target.value));
    setPaymentId(Number(e.target.value));
  };

  useEffect(() => {
    if (payments === undefined) {
      return;
    }

    if (paymentId === 0) {
      return;
    }

    setBalance(0);
    const paymentsIds = payments.map((payment) => payment.id);

    const selectedPaymentIndex: number = paymentsIds.indexOf(paymentId);
    const { current_value } = payments[selectedPaymentIndex];
    if (current_value) {
      setBalance(Number(current_value));
    }
  }, [payments]);

  const refreshAccount = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await refresh();
    setIsLoading(false);
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setOpenModal(true);
  };

  const handleEdit = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    if (paymentId === 0) {
      toast({
        title: '📣',
        description: 'Eu sou eterno! Não há como me editar.',
        status: 'info',
        ...toastConfig,
      });
      return;
    }
    push('/payment/[id]', `/payment/${paymentId}`);
  };

  const handleDeletePayment = async (): Promise<void> => {
    if (balance === 0) {
      toast({
        title: '😢',
        description: 'Não me delete, por favor!',
        status: 'error',
        ...toastConfig,
      });
      return;
    }

    if (paymentList !== undefined) {
      const filterPayments = paymentList.filter((payment) => payment.id !== paymentId);
      setPaymentList(filterPayments);
    }

    const response = await api.delete(`/payment/${paymentId}`);
    setBalance(0);
    setPaymentId(0);

    if (response.data.message) {
      toast({
        title: '📣',
        description: response.data.message,
        status: 'success',
        ...toastConfig,
      });
      setOpenModal(false);
      return;
    }
    toast({
      title: '📣',
      description: response.data.error,
      status: 'error',
      ...toastConfig,
    });

    setOpenModal(false);
  };

  const handleDeleteAllPurchases = async (): Promise<void> => {
    const response = await api.delete(`/acquisition/${paymentId}`);

    if (response.data.message) {
      toast({
        title: '📣',
        description: response.data.message,
        status: 'success',
        ...toastConfig,
      });
    } else {
      toast({
        title: '📣',
        description: response.data.error,
        status: 'error',
        ...toastConfig,
      });
    }

    await handleDeletePayment();
  };

  const handleAddAdditionalMoney = async () => {
    if (paymentId === 0) {
      toast({
        title: '📣',
        description: 'Eu sou eterno! Não há como me editar.',
        status: 'info',
        ...toastConfig,
      });
      return;
    }
    const { authToken, userId } = parseCookies();
    const infos: AddAdditionalValue = {
      userId: Number(userId),
      additionalValue,
      paymentId,
    };
    api.setAuthHeader(`Bearer ${authToken}`);
    const response = await api.post(`payment/${paymentId}`, { infos });

    if (response.data.message) {
      toast({
        title: '📣',
        description: response.data.message,
        status: 'success',
        ...toastConfig,
      });
    } else {
      toast({
        title: '📣',
        description: response.data.error,
        status: 'error',
        ...toastConfig,
      });
    }
    setAdditionalValue(0);
    console.log(additionalValue);
  };

  return (
    <Flex
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
      <AddAdditonalValue
        handleAddAdditionalMoney={handleAddAdditionalMoney}
        renderAdditionalValueForm={renderAdditionalValueForm}
        setAdditionalValue={setAdditionalValue}
        setRenderAdditionalValueForm={setRenderAdditionalValueForm}
      />
      <PragModal isOpen={openModal}>
        <ManagerContainer
          firstAction="Deletar apenas a conta"
          secondAction="Deletar a conta e os gastos"
          message="Deletar todas as compras/gastos pagas com esta forma de pagamento?"
          handleFirstAction={handleDeletePayment}
          handleSecondAction={handleDeleteAllPurchases}
          handleCancel={() => setOpenModal(false)}
        />
      </PragModal>
      <ModalLoader isOpen={isLoading} />
      <Grid
        templateColumns={{ base: 'none', md: 'repeat(2, 50%)', xl: 'repeat(3, 1fr)' }}
        templateRows={{ base: 'repeat(3, 1fr)', md: 'repeat(2, 1fr)', xl: 'none' }}
        width={{ base: '90%', xl: '100%' }}
        placeItems={{ base: 'start', md: 'center', xl: 'center' }}
        py={5}
        // flexDir={{ base: 'column', md: 'row' }}
        gap={{ base: 4, md: 4, xl: 0 }}
      >
        <GridItem
          height="100%"
          colSpan={{ base: 1, md: 2, xl: 1 }}
          width={{ base: '100%', md: 'none', xl: 'none' }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <PaymentMethodCard
            title="Suas contas"
          >
            <Select
              w="full"
              height="3.5em"
              bg="transparent"
              fontSize="18px"
              fontWeight="bold"
              borderRadius="5px"
              border="none"
              boxShadow="0 0 1em rgba(0, 0, 0, 0.4)"
              onChange={(e) => handleOnSelect(e)}
              color="#00E091"
            >
              <option value={0}>Selecione uma conta</option>
              {payments !== undefined && payments.map((payment) => (
                (payment !== undefined && <option style={{ color: '#06866c' }} key={payment.id} value={payment.id}>{payment.nickname}</option>)
              ))}
            </Select>
          </PaymentMethodCard>
        </GridItem>
        <PaymentMethodCard
          title="Saldo"
        >
          <Text
            w="40%"
            textAlign="center"
            p="0.1em"
            fontSize="18px"
            fontWeight="bold"
            color="#00E091"
          >
            R$
            {' '}
            {balance.toFixed(2).replace('.', ',')}
          </Text>
        </PaymentMethodCard>
        <PaymentActions
          setRenderAdditionalValueForm={setRenderAdditionalValueForm}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          refreshAccount={refreshAccount}
        />
      </Grid>
    </Flex>
  );
};

export default PaymentsMethods;
