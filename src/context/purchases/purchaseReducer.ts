import PurchaseModel from '../../serverless/data/models/PurchaseModel';

export interface PurchaseState {
  purchases: PurchaseModel[]
  paymentId: number
}

export interface PurchaseActions {
  type: 'POPULATE_PURCHASELIST' | 'CLEAR_PURCHASELIST' | 'DELETE_BY_PURCHASE_ID'
  purchases?: PurchaseModel[] | PurchaseModel
  paymentId?: number
  purchaseId?: number
}

const purchaseReducer = (state: PurchaseState, actions: PurchaseActions): PurchaseState => {
  if (actions.type === 'POPULATE_PURCHASELIST') {
    if (Array.isArray(actions.purchases)) {
      const newPurchaseState = [...state.purchases, ...actions.purchases];
      return {
        purchases: [...newPurchaseState],
        paymentId: actions.paymentId as number,
      };
    }

    const newPurchaseState = [...state.purchases, (actions.purchases as PurchaseModel)];
    return {
      purchases: [...newPurchaseState],
      paymentId: actions.paymentId as number,
    };
  }

  if (actions.type === 'DELETE_BY_PURCHASE_ID') {
    const updatePurchaseList = state.purchases.filter((purchase) => purchase.id !== actions.purchaseId);
    return {
      purchases: [...updatePurchaseList],
      paymentId: state.paymentId,
    };
  }

  return {
    purchases: [],
    paymentId: -1,
  };
};

export default purchaseReducer;
