import React, { useState, ChangeEvent } from 'react';
import { Flex, Select } from '@chakra-ui/react';
import GetForeignInfos from '../../serverless/data/usecases/GetForeignInfos';

const PaymentsMethods = ({ payments }: Omit<GetForeignInfos, 'purchases'>): JSX.Element => {
  const [balance, setBalance] = useState<number>(0);

  const handleOnSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    if (Number(e.target.value) === 0) {
      setBalance(0);
      return;
    }

    const paymentsIds = payments.map((payment) => payment.id);

    const selectedPaymentIndex: number = paymentsIds.indexOf(Number(e.target.value));

    setBalance(Number(payments[selectedPaymentIndex].default_value));
  };

  return (
    <Flex
      width="100%"
      justifyContent="flex-end"
      padding="1em"
    >
      <Flex
        width="30%"
        padding="0.8em"
        alignItems="center"
        justifyContent="center"
        bg="#fff"
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
          {payments !== undefined && payments.map((payment) => (
            <option key={payment.id} value={payment.id}>{payment.nickname}</option>
          ))}
        </Select>
        Saldo: R$
        {' '}
        {balance.toFixed(2).replace('.', ',')}
      </Flex>
    </Flex>
  );
};

export default PaymentsMethods;
