/* eslint-disable dot-notation */
import PayWithDAOImp from '../../../serverless/DAOImp/payWith/PayWithDAOImp';
import PayWithModel from '../../../serverless/data/models/PayWithModel';
import prisma from '../../../serverless/data/prisma/config';

afterAll(() => jest.resetAllMocks());

describe('PayWith DAO Implementation tests', () => {
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
    const spy = jest.spyOn(entity, 'create').mockImplementation(async () => {
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

  test('Should call GenericDAOImp update function with correct value', async () => {
    const acquisitionRequest: PayWithModel = {
      payment_id: 1,
      purchase_id: 1,
      value: 800,
    };

    // eslint-disable-next-line prefer-destructuring
    const spy = jest.spyOn(PayWithDAOImp.prototype, 'update').mockImplementation(async () => {
      const result = await Promise.resolve({
        payment_id: 1,
        purchase_id: 1,
        value: 800,
      });

      return result;
    });

    const purchaseStub = new PayWithDAOImp();

    await purchaseStub.update({
      where: {
        id: 1,
      },
      data: acquisitionRequest,
    });

    expect(spy).toHaveBeenCalledWith({
      data: acquisitionRequest,
      where: {
        id: 1,
      },
    });
  });

  test('Should call GenericDAOImp delete function with correct value', async () => {
    // eslint-disable-next-line prefer-destructuring
    const entity = new PayWithDAOImp()['entity'];
    const spy = jest.spyOn(entity, 'delete').mockImplementationOnce(jest.fn());

    const purchaseStub = new PayWithDAOImp();

    await purchaseStub.delete({
      where: {
        id: 1,
      },
    });

    expect(spy).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
  });
});
