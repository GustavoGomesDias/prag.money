import PaymentRepository from '../../serverless/repositories/payment/PaymentRepository';

const PaymentRepositoryMocked: PaymentRepository = jest.genMockFromModule('../../serverless/repositories/payment/PaymentRepository');

PaymentRepositoryMocked.add = jest.fn(async (infos) => {
  return await Promise.resolve({
    nickname: '',
    default_value: 800,
    reset_date: new Date(),
    user_id: 1,
  });
});

export default PaymentRepositoryMocked;