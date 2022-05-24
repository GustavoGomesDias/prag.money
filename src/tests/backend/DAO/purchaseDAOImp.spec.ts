/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayWith } from '@prisma/client';
import prisma from '../../../serverless/data/prisma/config';
import PurchaseDAOImp from '../../../serverless/DAOImp/purchase/PurchaseDAOImp';
import PurchaseModel from '../../../serverless/data/models/PurchaseModel';
import { BadRequestError, NotFoundError } from '../../../serverless/error/HttpError';
import GenericDAOImp from '../../../serverless/infra/DAO/GenericDAOImp';

describe('Purchase DAO Implementation', () => {
  test('Should call constructor with prisma.payment', () => {
    const purchaseDAOImpStub = new PurchaseDAOImp();

    // eslint-disable-next-line dot-notation
    expect(purchaseDAOImpStub['entity']).toEqual(prisma.purchase);
  });

  test('Should returns undefined if acquistion list is empty', async () => {
    const purchaseDAOImpStub = new PurchaseDAOImp();

    await expect(purchaseDAOImpStub.returnsPurchaseByAcquisitionsList([])).rejects.toThrow(new BadRequestError('Não há compras relacionadas a essa forma de pagamento.'));
  });

  test('Should returns not found error if not exists matching purchases', async () => {
    const purchaseDAOImpStub = new PurchaseDAOImp();
    const data = [{
      payment_id: 1,
      purchase_id: 1,
      value: 1,
    }];

    await expect(purchaseDAOImpStub.returnsPurchaseByAcquisitionsList(data)).rejects.toThrow(new NotFoundError('Algo de errado não está certo. Não foi possível encontrar compras para assa aquisição.'));
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

  test('Should call deletePurchasesByAcquisisitionList with correct values', async () => {
    const acquisitionList: PayWith[] = [{
      id: 1,
      payment_id: 1,
      purchase_id: 1,
      value: 1,
    }];

    const spy = jest.spyOn(PurchaseDAOImp.prototype, 'deletePurchasesByAcquisisitionList').mockImplementationOnce(jest.fn());

    const purchaseStub = new PurchaseDAOImp();
    await purchaseStub.deletePurchasesByAcquisisitionList(acquisitionList);

    expect(spy).toHaveBeenCalledWith(acquisitionList);
  });

  test('Should call deletePurchasesByAcquisisitionList/delete with correct values', async () => {
    const acquisitionList: PayWith[] = [{
      id: 1,
      payment_id: 1,
      purchase_id: 1,
      value: 1,
    }];

    const spy = jest.spyOn(PurchaseDAOImp.prototype, 'delete').mockImplementationOnce(jest.fn());

    const purchaseStub = new PurchaseDAOImp();
    await purchaseStub.deletePurchasesByAcquisisitionList(acquisitionList);

    expect(spy).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
  });

  test('Should call deletePurchasesByAcquisisitionList/delete by 3 times', async () => {
    const acquisitionList: PayWith[] = [{
      id: 1,
      payment_id: 1,
      purchase_id: 1,
      value: 1,
    }, {
      id: 1,
      payment_id: 1,
      purchase_id: 1,
      value: 1,
    }, {
      id: 1,
      payment_id: 1,
      purchase_id: 1,
      value: 1,
    }];

    const spy = jest.spyOn(PurchaseDAOImp.prototype, 'delete').mockImplementation(jest.fn());

    const purchaseStub = new PurchaseDAOImp();
    await purchaseStub.deletePurchasesByAcquisisitionList(acquisitionList);

    expect(spy).toHaveBeenCalledTimes(3);
  });

  test('Should call checkIfPurchaseExists if correct purchaseId', async () => {
    const req = 1;
    const purchaseStub = new PurchaseDAOImp();

    const spy = jest.spyOn(purchaseStub, 'checkIfPurchaseExists').mockImplementationOnce(jest.fn());
    await purchaseStub.checkIfPurchaseExists(req);

    expect(spy).toHaveBeenCalledWith(req);
  });

  test('Should ensure that checkIfPurchaseExists throws an error if the purchase does not exist', async () => {
    const req = 1;
    const purchaseStub = new PurchaseDAOImp();

    jest.spyOn(GenericDAOImp.prototype, 'findUnique').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve(undefined);

      return result;
    });

    await expect(purchaseStub.checkIfPurchaseExists(req)).rejects.toThrow(new NotFoundError('Compra/gasto não encontrada.'));
  });
});
