import PaymentDAOImp from '../../../serverless/DAOImp/payment/PaymentDAOImp';
import prisma from '../../../serverless/data/prisma/config';

describe('Payment DAO Implementation tests', () => {
  test('Should call constructor with prisma.payment', () => {
    const paymentDAOStub = new PaymentDAOImp();

    // eslint-disable-next-line dot-notation
    expect(paymentDAOStub['entity']).toEqual(prisma.payment);
  });
});
