const purchaseDate = new Date('2022-05-20T18:33:18.189Z');
export const mockPayment = {
  nickname: 'nickname',
  default_value: 800,
  current_value: 5,
  reset_day: purchaseDate.getDate(),
  user_id: 1,
  PayWith: {
    payment_id: 1,
    purchase_id: 1,
    value: 1,
    purchase: {
      created_at: purchaseDate.toISOString(),
    },
  },
};

export const { PayWith, ...rest } = mockPayment;
export const mockPaymentWithArray = {
  PayWith: [PayWith],
  ...rest,
};

export const mockPurchase = {
  id: 1,
  value: 1,
  description: 'description',
  purchase_date: purchaseDate,
  user_id: 1,
};
