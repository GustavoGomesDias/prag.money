import { createContext } from 'react';
import PurchaseModel from '../../serverless/data/models/PurchaseModel';

export interface PurchaseContextType {
  purchases: PurchaseModel[]
  handleGetPurchasesByPaymentId(paymentId: number): Promise<void>
}

const PurchaseContext = createContext<PurchaseContextType>({
  purchases: [],
  handleGetPurchasesByPaymentId: async (paymentId: number) => {
    console.log(paymentId);
  },
});

export default PurchaseContext;
