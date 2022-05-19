import PurchaseModel from '../../serverless/data/models/PurchaseModel';

export interface PurchaseState {
  purchases: PurchaseModel[]
}

export interface PurchaseActions {
  type: 'POPULATE_PURCHASELIST' | 'CLEAR_PURCHASELIST' | 'DELETE_BY_PURCHASE_ID'
  purchases?: PurchaseModel[] | PurchaseModel
  purchaseId?: number
}

const purchaseReducer = (state: PurchaseState, actions: PurchaseActions): PurchaseState => {
  if (actions.type === 'POPULATE_PURCHASELIST') {
    if (Array.isArray(actions.purchases)) {
      const newPurchaseState = [...state.purchases, ...actions.purchases];
      return {
        purchases: [...newPurchaseState],
      };
    }

    const newPurchaseState = [...state.purchases, (actions.purchases as PurchaseModel)];
    return {
      purchases: [...newPurchaseState],
    };
  }

  if (actions.type === 'DELETE_BY_PURCHASE_ID') {
    const updatePurchaseList = state.purchases.filter((purchase) => purchase.id !== actions.purchaseId);
    return {
      purchases: [...updatePurchaseList],
    };
  }

  return {
    purchases: [],
  };
};

export default purchaseReducer;
