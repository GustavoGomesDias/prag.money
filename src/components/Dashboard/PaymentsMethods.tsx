/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, ChangeEvent, useContext, MouseEvent, useEffect,
} from 'react';
import {
  Flex, IconButton, Select, Text, Tooltip, useToast, keyframes, Grid, GridItem,
} from '@chakra-ui/react';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { ImLoop2 } from 'react-icons/im';
import { useRouter } from 'next/router';

import PurchaseContext from '../../context/purchases/PurchaseContext';
import PaymentModel from '../../serverless/data/models/PaymentModel';
import api from '../../services/fetchAPI/init';
import toastConfig from '../../utils/config/tostConfig';
import PragModal from '../Layout/PragModal';
import ManagerContainer from '../Layout/ManagerContainer';
import ModalLoader from '../UI/Loader/ModalLoader';
import PaymentContext from '../../context/payment/PaymentContext';
import PaymentMethodCard from './PaymentMethodCard';

export interface PaymentsMethodsProps {
  refresh(): Promise<void>
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
`;

const animationSpin = `${spin} 1.5s ease-in-out`;

const PaymentsMethods = ({ refresh }: PaymentsMethodsProps): JSX.Element => {
  const purchaseCtx = useContext(PurchaseContext);
  const { payments } = useContext(PaymentContext);

  const [balance, setBalance] = useState<number>(0);
  const [paymentId, setPaymentId] = useState<number>(0);
  const [paymentList, setPaymentList] = useState<PaymentModel[] | undefined>(payments);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  return (
    <Flex
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
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
          <PaymentMethodCard>
            <Select
              w="full"
              height="3.5em"
              bg="transparent"
              fontSize="18px"
              fontWeight="bold"
              borderRadius="5px"
              onChange={(e) => handleOnSelect(e)}
            >
              <option value={0}>Selecione uma forma de pagamento</option>
              {payments !== undefined && payments.map((payment) => (
                (payment !== undefined && <option key={payment.id} value={payment.id}>{payment.nickname}</option>)
              ))}
            </Select>
          </PaymentMethodCard>
        </GridItem>
        <PaymentMethodCard>
          <Text
            w="40%"
            textAlign="center"
            p="0.1em"
            fontSize="18px"
            fontWeight="bold"
          >
            Saldo: R$
            {' '}
            {balance.toFixed(2).replace('.', ',')}
          </Text>
        </PaymentMethodCard>
        <PaymentMethodCard>
          <Tooltip
            hasArrow
            label="Editar conta"
            placement="left-start"
          >

            <IconButton
              bg="none"
              aria-label="Edit account"
              icon={<FaRegEdit />}
              transition="0.5ms"
              _hover={{
                color: '#00E091',
              }}
              w="50px"
              h="50px"
              size="lg"
              onClick={(e) => handleEdit(e)}
            />
          </Tooltip>
          <Tooltip
            hasArrow
            label="Excluir conta"
            placement="right-start"
          >
            <IconButton
              bg="none"
              aria-label="Delete account"
              icon={<FaTrashAlt />}
              transition="0.5ms"
              _hover={{
                color: '#e85f7a',
              }}
              w="50px"
              h="50px"
              size="lg"
              onClick={(e) => handleDelete(e)}
            />
          </Tooltip>

          <Tooltip
            hasArrow
            label="Refrash"
            placement="right-start"
          >

            <IconButton
              bg="none"
              aria-label="Search database"
              icon={<ImLoop2 />}
              _hover={{
                color: '#049579',
                animation: animationSpin,
              }}
              w="50px"
              h="50px"
              size="lg"
              onClick={async (e) => {
                await refreshAccount(e);
              }}
            />
          </Tooltip>
        </PaymentMethodCard>
      </Grid>
    </Flex>
  );
};

export default PaymentsMethods;
