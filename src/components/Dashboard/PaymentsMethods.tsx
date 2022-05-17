/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, ChangeEvent, useContext, MouseEvent, useEffect,
} from 'react';
import {
  Button, Flex, Select, Text, Tooltip, useToast,
} from '@chakra-ui/react';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';

import PurchaseContext from '../../context/purchases/PurchaseContext';
import PaymentModel from '../../serverless/data/models/PaymentModel';
import api from '../../services/fetchAPI/init';
import toastConfig from '../../utils/config/tostConfig';
import PragModal from '../Layout/PragModal';
import ManagerContainer from '../Layout/ManagerContainer';

export interface PaymentsMethodsProps {
  payments: PaymentModel[] | undefined
}

const PaymentsMethods = ({ payments }: PaymentsMethodsProps): JSX.Element => {
  const [balance, setBalance] = useState<number>(0);
  const [paymentId, setPaymentId] = useState<number>(0);
  const [paymentList, setPaymentList] = useState<PaymentModel[] | undefined>(payments);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const purchaseCtx = useContext(PurchaseContext);
  const { push } = useRouter();

  const toast = useToast();

  useEffect(() => {
    if (paymentId === 0) {
      purchaseCtx.handleClearPurchaseList();
    }
  }, [paymentId]);

  useEffect(() => {
    if (payments !== undefined) setPaymentList([...payments]);
  }, []);

  useEffect(() => {
    if (paymentList !== undefined) setPaymentList([...paymentList]);
  }, [paymentId]);

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

      setBalance(Number(payments[selectedPaymentIndex].default_value));
      await purchaseCtx.handleGetPurchasesByPaymentId(Number(e.target.value));
      setPaymentId(Number(e.target.value));
      return;
    }

    const paymentsIds = payments.map((payment) => payment.id);

    const selectedPaymentIndex: number = paymentsIds.indexOf(Number(e.target.value));

    setBalance(Number(payments[selectedPaymentIndex].default_value));
    purchaseCtx.handleClearPurchaseList();
    await purchaseCtx.handleGetPurchasesByPaymentId(Number(e.target.value));
    setPaymentId(Number(e.target.value));
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

    // Usar filter
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
      justifyContent="flex-end"
      padding="2em"
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
      <Flex
        width={{ base: '100%', md: '60%', xl: '40%' }}
        padding="0.8em"
        alignItems="center"
        justifyContent="center"
        bg="#fff"
        borderRadius="15px"
        border="2px solid #00735C"
        flexDir="column"
      >
        <Flex
          padding="0.8em"
          alignItems="center"
          justifyContent="center"
          borderRadius="5px"
          border="2px solid #00735C"
        >
          <Select
            variant="outline"
            width="50%"
            height="2.5em"
            mr="15px"
            bg="#fff"
            borderRadius="5px"
            border="2px solid #00735C"
            borderColor="initial"
            onChange={(e) => handleOnSelect(e)}
          >
            <option value={0}>Selecione uma forma de pagamento</option>
            {paymentList !== undefined && paymentList.map((payment) => (
              <option key={payment.id} value={payment.id}>{payment.nickname}</option>
            ))}
          </Select>
          <Text w="40%" textAlign="center" p="0.1em">
            Saldo: R$
            {' '}
            {balance.toFixed(2).replace('.', ',')}
          </Text>
        </Flex>
        <Flex width="10%">
          <Tooltip
            hasArrow
            label="Editar conta"
            placement="left-start"
          >
            <Button
              bg="none"
              _hover={{
                color: '#049579',
              }}
              leftIcon={<FaRegEdit />}
              w="100%"
              onClick={(e) => handleEdit(e)}
            />
          </Tooltip>
          <Tooltip
            hasArrow
            label="Excluir conta"
            placement="right-start"
          >
            <Button
              bg="none"
              _hover={{
                color: '#e85f7a',
              }}
              leftIcon={<FaTrashAlt />}
              w="100%"
              onClick={(e) => handleDelete(e)}
            />
          </Tooltip>

        </Flex>
      </Flex>
    </Flex>
  );
};

export default PaymentsMethods;
