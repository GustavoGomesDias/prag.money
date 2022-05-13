import { useToast } from '@chakra-ui/react';
import React, { useMemo, useReducer, useState } from 'react';
import ModalLoader from '../../components/UI/Loader/ModalLoader';
import GetForeignInfos from '../../serverless/data/usecases/GetForeignInfos';
import api from '../../services/fetchAPI/init';
import toastConfig from '../../utils/config/tostConfig';
import PurchaseContext from './PurchaseContext';
import purchaseReducer from './purchaseReducer';

export interface PurchaseProviderProps {
  children: JSX.Element | JSX.Element[]
}

export default function PurchaseProvider({ children }: PurchaseProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [purchasesState, dispatchPurchasesActions] = useReducer(purchaseReducer, {
    purchases: [],
  });

  const toast = useToast();

  const handleGetPurchasesByPaymentId = async (paymentId: number) => {
    setIsLoading(true);
    const response = await api.get(`/acquisition/${paymentId}`);

    if (response.data.error) {
      setIsLoading(false);
      toast({
        title: '📣',
        description: response.data.error,
        status: 'info',
        ...toastConfig,
      });
      return;
    }
    const content = response.data.content as Omit<GetForeignInfos, 'payments'>;
    dispatchPurchasesActions({
      type: 'POPULATE_PURCHASELIST',
      purchases: content.purchases,
    });
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleClearPurchaseList = () => {
    dispatchPurchasesActions({
      type: 'CLEAR_PURCHASELIST',
      purchases: [],
    });
  };

  const context = useMemo(() => ({
    purchases: purchasesState.purchases,
    handleGetPurchasesByPaymentId,
    handleClearPurchaseList,
  }), [purchasesState]);

  return (
    <PurchaseContext.Provider value={context}>
      {isLoading && <ModalLoader isOpen={isLoading} />}
      {children}
    </PurchaseContext.Provider>
  );
}
