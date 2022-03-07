/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import PaymentRepository from '../../serverless/repositories/payment/PaymentRepository';

const PaymentRepositoryMocked: PaymentRepository = jest.genMockFromModule('../../serverless/repositories/payment/PaymentRepository');

PaymentRepositoryMocked.add = jest.fn(async (infos) => {
  const result = await Promise.resolve({
    nickname: '',
    default_value: 800,
    reset_date: new Date(),
    user_id: 1,
  });

  return result;
});

export default PaymentRepositoryMocked;
