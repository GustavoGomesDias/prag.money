/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable dot-notation */
import PaymentController from '../../../../serverless/api/controllers/PaymentController';
import PurchaseController from '../../../../serverless/api/controllers/PurchaseController';
import { badRequest } from '../../../../serverless/api/helpers/http';
import PaymentDAOImp from '../../../../serverless/DAOImp/payment/PaymentDAOImp';
import PurchaseDAOImp from '../../../../serverless/DAOImp/purchase/PurchaseDAOImp';
import PaymentModel from '../../../../serverless/data/models/PaymentModel';
import PurchaseModel from '../../../../serverless/data/models/PurchaseModel';
import { BadRequestError } from '../../../../serverless/error/HttpError';

const makeSut = (): PurchaseController => {
  const daoIMP = new PurchaseDAOImp();
  const controllerStub = new PurchaseController(daoIMP);
  return controllerStub;
};

describe('Handle Get By Purchase Id', () => {
  test('Should return 400 if invalid user id is provided', async () => {
    const controllerStub = makeSut();
    // eslint-disable-next-line prefer-destructuring
    const entity = new PurchaseDAOImp()['entity'];
    jest.spyOn(entity, 'findUnique').mockImplementationOnce(jest.fn());

    const result = await controllerStub.handleGetPurchaseById(-1);

    expect(result).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 200 with content if get purchase it happened successfully', async () => {
    const date = new Date();
    const purchase: PurchaseModel = {
      description: 'description',
      purchase_date: date,
      user_id: 1,
      value: 12,
    };
    // eslint-disable-next-line prefer-destructuring
    jest.spyOn(PurchaseDAOImp.prototype, 'findUnique').mockImplementationOnce(async (info) => {
      const result = await Promise.resolve({
        description: 'description',
        purchase_date: date,
        user_id: 1,
        value: 12,
      });

      return result;
    });

    const controllerStub = makeSut();
    const result = await controllerStub.handleGetPurchaseById(1);

    expect(result.content).toEqual({ purchase });

    expect(result.statusCode).toEqual(200);
  });
});
