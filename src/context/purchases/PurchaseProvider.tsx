import React, { useMemo, useReducer } from 'react';
import GetForeignInfos from '../../serverless/data/usecases/GetForeignInfos';
import api from '../../services/fetchAPI/init';
import PurchaseContext from './PurchaseContext';
import purchaseReducer from './purchaseReducer';

export interface PurchaseProviderProps {
  children: JSX.Element | JSX.Element[]
}

export default function PurchaseProvider({ children }: PurchaseProviderProps) {
  const [purchasesState, dispatchPurchasesActions] = useReducer(purchaseReducer, {
    purchases: [],
  });

  const handleGetPurchasesByPaymentId = async (paymentId: number) => {
    const response = await api.get(`/payment/${paymentId}`);
    const content = response.data.content as Omit<GetForeignInfos, 'payments'>;
    console.log(content.purchases);
    dispatchPurchasesActions({
      type: 'UPDATE_PURCHASELIST',
      purchases: content.purchases,
    });
  };

  const context = useMemo(() => ({
    purchases: purchasesState.purchases,
    handleGetPurchasesByPaymentId,
  }), [purchasesState]);

  return (
    <PurchaseContext.Provider value={context}>
      {children}
    </PurchaseContext.Provider>
  );
}
