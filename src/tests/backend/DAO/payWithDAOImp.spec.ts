import PayWithDAOImp from '../../../serverless/DAOImp/payWith/PayWithDAOImp';
import PayWithModel from '../../../serverless/data/models/PayWithModel';
import prisma from '../../../serverless/data/prisma/config';
import GenericDAOImp from '../../../serverless/infra/DAO/GenericDAOImp';

describe('Payment DAO Implementation tests', () => {
  test('Should call constructor with prisma.payWith', () => {
    const payWithtDAOStub = new PayWithDAOImp();

    // eslint-disable-next-line dot-notation
    expect(payWithtDAOStub['entity']).toEqual(prisma.payWith);
  });

  test('Should call GenericDAOImp add function with correct value', async () => {
    const acquisitionRequest: PayWithModel = {
      payment_id: 1,
      purchase_id: 1,
      value: 800,
    };

    const spy = jest.spyOn(GenericDAOImp.prototype, 'add').mockImplementationOnce(async () => {
      const result = await Promise.resolve({
        payment_id: 1,
        purchase_id: 1,
        value: 800,
      });

      return result;
    });

    const payWithtDAOStub = new PayWithDAOImp();

    await payWithtDAOStub.add(acquisitionRequest);

    expect(spy).toHaveBeenCalledWith(acquisitionRequest);
  });
});
