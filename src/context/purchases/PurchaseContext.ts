import { createContext } from 'react';
import PurchaseModel from '../../serverless/data/models/PurchaseModel';

export interface PurchaseContextType {
  purchases: PurchaseModel[]
  paymentId: number
  handleGetPurchasesByPaymentId(paymentId: number): Promise<void>
  handleDeletePurchaseById(purchaseId: number): void
  handleClearPurchaseList(): void
}

const PurchaseContext = createContext<PurchaseContextType>({
  purchases: [],
  paymentId: -1,
  handleGetPurchasesByPaymentId: async (paymentId: number) => {
    console.log(paymentId);
  },
  handleClearPurchaseList: () => (1 + 1),
  handleDeletePurchaseById: (purchaseId: number) => (purchaseId + 1),
});

export default PurchaseContext;
