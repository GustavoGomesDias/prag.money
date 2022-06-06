/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createContext } from 'react';
import PaymentModel from '../../serverless/data/models/PaymentModel';

export interface PaymentContextType {
  payments: PaymentModel[]
  handleSetPayments(payments: PaymentModel[]): void
}

const PaymentContext = createContext<PaymentContextType>({
  payments: [],
  handleSetPayments: (payments: PaymentModel[]) => (1 + 1),
});

export default PaymentContext;
