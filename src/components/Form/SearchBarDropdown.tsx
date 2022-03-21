import React, {
  ChangeEvent, MouseEvent, useRef,
} from 'react';
import {
  Button, Flex, ListItem, UnorderedList, useToast,
} from '@chakra-ui/react';
import BasicInput from '../Login/BasicInput';
import PaymentModel from '../../serverless/data/models/PaymentModel';
import classes from './SearchBarDropdown.module.css';
import toastConfig from '../../utils/config/tostConfig';

export interface SearchBarDropdownProps {
  payments: PaymentModel[]
  hanldeSearchPayment: (e: ChangeEvent<HTMLInputElement>) => void
  setPaymentsSelecteds: React.Dispatch<React.SetStateAction<PaymentModel[]>>
  paymentsSelecteds: PaymentModel[]
}

const SearchBarDropdown = ({
  payments, hanldeSearchPayment, setPaymentsSelecteds, paymentsSelecteds,
}: SearchBarDropdownProps): JSX.Element => {
  const basicInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleDeletePaymentSelected = (e: MouseEvent<HTMLButtonElement>, nickname: string): void => {
    e.preventDefault();
    const nickList: string[] = paymentsSelecteds.map((payment) => payment.nickname);

    const delPaymentIndex = nickList.indexOf(nickname);

    if (delPaymentIndex !== -1) {
      paymentsSelecteds.splice(delPaymentIndex, 1);
    }
    setPaymentsSelecteds([...paymentsSelecteds]);
  };

  const handlePaymentsSelecteds = (e: MouseEvent<HTMLButtonElement>, payment: PaymentModel): void => {
    e.preventDefault();

    if (paymentsSelecteds.indexOf(payment) === -1) {
      paymentsSelecteds.push(payment);
      setPaymentsSelecteds([...paymentsSelecteds]);
    } else {
      toast({
        title: '😉',
        description: 'Forma de pagamento já foi adicionada.',
        status: 'info',
        ...toastConfig,
      });
    }

    if (basicInputRef.current !== null) {
      basicInputRef.current.value = '';
      console.log(basicInputRef.current.value);
    }
  };
  return (
    <div>
      <BasicInput ref={basicInputRef} id="search-payment" label="Formas de pagamento:" onChangeHandle={hanldeSearchPayment} placeholder="Search" />
      <UnorderedList
        margin="0"
        width="100%"
      >
        {payments.map((payment) => (
          <ListItem
            width="100%"
            key={`${payment.nickname}-${payment.id}`}
          >
            <Button
              width="100%"
              textAlign="left"
              borderRadius="0px"
              borderColor="rgba(0, 0, 0, 0.1)"
              borderWidth="1px"
              onClick={(e) => handlePaymentsSelecteds(e, payment)}
            >
              {payment.nickname}
            </Button>
          </ListItem>
        ))}
      </UnorderedList>
      <Flex
        width="100%"
      >
        {paymentsSelecteds.length > 0 && paymentsSelecteds.map((payment) => (
          <Flex
            mt="5px"
            background="#E2E8F0"
            borderRadius="5px"
            alignItems="center"
            justifyContent="center"
            ml="5px"
            key={payment.nickname}
          >
            <span className={classes.nickname}>{payment.nickname}</span>
            <button
              type="button"
              className={classes['remove-payment']}
              onClick={(e) => handleDeletePaymentSelected(e, payment.nickname)}
            >
              x
            </button>
          </Flex>
        ))}
      </Flex>
    </div>
  );
};

export default SearchBarDropdown;
