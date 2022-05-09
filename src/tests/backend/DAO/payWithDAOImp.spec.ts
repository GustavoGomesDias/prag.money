/* eslint-disable dot-notation */
import PayWithDAOImp from '../../../serverless/DAOImp/payWith/PayWithDAOImp';
import PayWithModel from '../../../serverless/data/models/PayWithModel';
import prisma from '../../../serverless/data/prisma/config';

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

    // eslint-disable-next-line prefer-destructuring
    const entity = new PayWithDAOImp()['entity'];
    const spy = jest.spyOn(entity, 'create').mockImplementationOnce(async () => {
      const result = await Promise.resolve({
        payment_id: 1,
        purchase_id: 1,
        value: 800,
      });

      return result;
    });

    const payWithtDAOStub = new PayWithDAOImp();

    await payWithtDAOStub.add(acquisitionRequest);

    expect(spy).toHaveBeenCalledWith({
      data: acquisitionRequest,
    });
  });
});
