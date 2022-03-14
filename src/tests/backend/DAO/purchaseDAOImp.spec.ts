import prisma from '../../../serverless/data/prisma/config';

describe('Purchase DAO Implementation', () => {
  test('Should call constructor with prisma.payment', () => {
    const purchaseDAOImp = new PurchaseDAOImp();

    // eslint-disable-next-line dot-notation
    expect(purchaseDAOImp['entity']).toEqual(prisma.purchase);
  });
});
