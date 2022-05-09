/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from '../../../serverless/data/prisma/config';
import PurchaseDAOImp from '../../../serverless/DAOImp/purchase/PurchaseDAOImp';
import PurchaseModel from '../../../serverless/data/models/PurchaseModel';

describe('Purchase DAO Implementation', () => {
  test('Should call constructor with prisma.payment', () => {
    const purchaseDAOImpStub = new PurchaseDAOImp();

    // eslint-disable-next-line dot-notation
    expect(purchaseDAOImpStub['entity']).toEqual(prisma.purchase);
  });

  test('Should returns undefined if acquistion list is empty', async () => {
    const purchaseDAOImpStub = new PurchaseDAOImp();

    const response = await purchaseDAOImpStub.returnsPurchaseByAcquisitionsList([]);

    expect(response).toEqual(undefined);
  });

  test('Should returns undefined if not exists matching purchases', async () => {
    const purchaseDAOImpStub = new PurchaseDAOImp();

    const response = await purchaseDAOImpStub.returnsPurchaseByAcquisitionsList([{
      payment_id: 1,
      purchase_id: 1,
      value: 1,
    }]);

    expect(response).toEqual(undefined);
  });

  test('Should returns purchase list of acquisition list is not empty and has matching', async () => {
    const purchaseDAOImpStub = new PurchaseDAOImp();
    const date = new Date();

    // eslint-disable-next-line no-unused-vars
    jest.spyOn(PurchaseDAOImp.prototype, 'findUnique').mockImplementationOnce(async (info) => {
      const result = await Promise.resolve({
        id: 1,
        value: 1,
        description: 'Almoço nas Bahamas',
        purchase_date: date,
        user_id: 1,
      });

      return result;
    });

    const response = await purchaseDAOImpStub.returnsPurchaseByAcquisitionsList([{
      payment_id: 1,
      purchase_id: 1,
      value: 1,
    }]);

    expect(response).toEqual([{
      id: 1,
      value: 1,
      description: 'Almoço nas Bahamas',
      purchase_date: date,
      user_id: 1,
    }]);
  });

  test('Should call GenericDAOImp add function with correct value', async () => {
    const purchaseRequest: PurchaseModel = {
      value: 11,
      description: 'description',
      purchase_date: new Date(),
      user_id: 1,
    };

    // eslint-disable-next-line prefer-destructuring
    const entity = new PurchaseDAOImp()['entity'];
    const spy = jest.spyOn(entity, 'create').mockImplementationOnce(async () => {
      const result = await Promise.resolve({
        value: 11,
        description: 'description',
        purchase_date: new Date(),
        user_id: 1,
      });

      return result;
    });

    const purchaseStub = new PurchaseDAOImp();

    await purchaseStub.add(purchaseRequest);

    expect(spy).toHaveBeenCalledWith({
      data: purchaseRequest,
    });
  });

  test('Should call GenericDAOImp update function with correct value', async () => {
    const purchaseRequest: PurchaseModel = {
      value: 11,
      description: 'description',
      purchase_date: new Date(),
      user_id: 1,
    };

    // eslint-disable-next-line prefer-destructuring
    const entity = new PurchaseDAOImp()['entity'];
    const spy = jest.spyOn(entity, 'update').mockImplementationOnce(async () => {
      const result = await Promise.resolve({
        value: 11,
        description: 'description',
        purchase_date: new Date(),
        user_id: 1,
      });

      return result;
    });

    const purchaseStub = new PurchaseDAOImp();

    await purchaseStub.update({
      where: {
        id: 1,
      },
      data: purchaseRequest,
    });

    expect(spy).toHaveBeenCalledWith({
      data: purchaseRequest,
      where: {
        id: 1,
      },
    });
  });

  test('Should call GenericDAOImp delete function with correct value', async () => {
    // eslint-disable-next-line prefer-destructuring
    const entity = new PurchaseDAOImp()['entity'];
    const spy = jest.spyOn(entity, 'delete').mockImplementationOnce(jest.fn());

    const purchaseStub = new PurchaseDAOImp();

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
