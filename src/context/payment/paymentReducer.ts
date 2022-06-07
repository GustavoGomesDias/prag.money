import PaymentModel from '../../serverless/data/models/PaymentModel';

export interface PaymentState {
  payments: PaymentModel[]
}

export interface PaymentActions {
  type: 'POPULATE_PAYMENT_LIST' | 'CLEAR_LIST'
  payments: PaymentModel[]
}

const paymentReducer = (state: PaymentState, actions: PaymentActions): PaymentState => {
  if (actions.type === 'POPULATE_PAYMENT_LIST') {
    return {
      payments: actions.payments,
    };
  }

  return {
    payments: [],
  };
};

export default paymentReducer;
