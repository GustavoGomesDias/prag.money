import PurchaseModel from '../../serverless/data/models/PurchaseModel';

export interface PurchaseState {
  purchases: PurchaseModel[]
}

export interface PurchaseActions {
  type: 'UPDATE_PURCHASELIST'
  purchases: PurchaseModel[] | PurchaseModel
}

const purchaseReducer = (state: PurchaseState, actions: PurchaseActions): PurchaseState => {
  if (actions.type === 'UPDATE_PURCHASELIST') {
    if (Array.isArray(actions.purchases)) {
      const newPurchaseState = [...state.purchases, ...actions.purchases];
      return {
        purchases: [...newPurchaseState],
      };
    }

    const newPurchaseState = [...state.purchases, actions.purchases];
    return {
      purchases: [...newPurchaseState],
    };
  }

  return {
    purchases: [],
  };
};

export default purchaseReducer;
