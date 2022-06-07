import React, { useMemo, useReducer } from 'react';
import PaymentModel from '../../serverless/data/models/PaymentModel';
import { PragMoneyProviderProps } from '../types/PragMoneyProviderProps';
import PaymentContext from './PaymentContext';
import paymentReducer from './paymentReducer';

export default function PaymentProvider({ children }: PragMoneyProviderProps) {
  const [paymentState, dispatchPaymentsActions] = useReducer(paymentReducer, {
    payments: [],
  });

  const handleSetPayments = (payments: PaymentModel[]) => {
    dispatchPaymentsActions({
      type: 'POPULATE_PAYMENT_LIST',
      payments,
    });
  };

  const context = useMemo(() => ({
    payments: paymentState.payments,
    handleSetPayments,
  }), [paymentState]);

  return (
    <PaymentContext.Provider value={context}>
      {children}
    </PaymentContext.Provider>
  );
}
