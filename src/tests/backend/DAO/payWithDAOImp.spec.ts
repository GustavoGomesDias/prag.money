import PayWithDAOImp from '../../../serverless/DAOImp/payWith/PayWithDAOImp';
import prisma from '../../../serverless/data/prisma/config';

describe('Payment DAO Implementation tests', () => {
  test('Should call constructor with prisma.payWith', () => {
    const payWithtDAOStub = new PayWithDAOImp();

    // eslint-disable-next-line dot-notation
    expect(payWithtDAOStub['entity']).toEqual(prisma.payWith);
  });
});
