import React, { MouseEvent } from 'react';
import { Flex } from '@chakra-ui/react';
import PaymentModel from '../../serverless/data/models/PaymentModel';
import classes from './SearchBarDropdown.module.css';

export interface InfoOfSelectedsProps {
  renderButton: boolean
  payment: PaymentModel
  handleDeletePaymentSelected?: (e: MouseEvent<HTMLButtonElement>, nickname: string) => void
}

const InfoOfSelecteds = ({ payment, renderButton, handleDeletePaymentSelected }: InfoOfSelectedsProps): JSX.Element => (
  <Flex
    mt={renderButton ? '5px' : '0px'}
    background={renderButton ? '#E2E8F0' : '#00735C'}
    borderRadius="5px"
    alignItems="center"
    justifyContent="center"
    ml={renderButton ? '5px' : '0px'}
    key={payment.nickname}
    color={!renderButton ? '#fff' : ''}
    fontSize={!renderButton ? '18px' : ''}
  >
    <span className={classes.nickname}>{payment.nickname}</span>
    {renderButton && (
      <button
        type="button"
        className={classes['remove-payment']}
        onClick={(e) => handleDeletePaymentSelected !== undefined && handleDeletePaymentSelected(e, payment.nickname)}
      >
        x
      </button>
    )}
  </Flex>
);

export default InfoOfSelecteds;
