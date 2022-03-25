import { createContext } from 'react';
import PurchaseModel from '../../serverless/data/models/PurchaseModel';

export interface PurchaseContextType {
  purchases: PurchaseModel[]
  handleGetPurchasesByPaymentId(paymentId: number): Promise<void>
  handleClearPurchaseList(): void
}

const PurchaseContext = createContext<PurchaseContextType>({
  purchases: [],
  handleGetPurchasesByPaymentId: async (paymentId: number) => {
    console.log(paymentId);
  },
  handleClearPurchaseList: () => (1 + 1),
});

export default PurchaseContext;
