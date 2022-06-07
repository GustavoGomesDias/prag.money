/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable dot-notation */
import PaymentController from '../../../../serverless/api/controllers/PaymentController';
import PurchaseController from '../../../../serverless/api/controllers/PurchaseController';
import { badRequest, forbidden } from '../../../../serverless/api/helpers/http';
import PurchaseDAOImp from '../../../../serverless/DAOImp/purchase/PurchaseDAOImp';
import PurchaseModel from '../../../../serverless/data/models/PurchaseModel';
import { BadRequestError, ForbiddenError } from '../../../../serverless/error/HttpError';
import handleErrors from '../../../../serverless/error/helpers/handleErrors';

const makeSut = (): PurchaseController => {
  const daoIMP = new PurchaseDAOImp();
  const controllerStub = new PurchaseController(daoIMP);
  return controllerStub;
};

afterAll(() => jest.resetAllMocks());

describe('Handle Get By Purchase Id', () => {
  test('Should return 400 if invalid user id is provided', async () => {
    const controllerStub = makeSut();
    // eslint-disable-next-line prefer-destructuring
    const entity = new PurchaseDAOImp()['entity'];
    jest.spyOn(entity, 'findUnique').mockImplementationOnce(jest.fn());

    const result = await controllerStub.handleGetPurchaseById(-1, 1);

    expect(result).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 400 if invalid user id is provided', async () => {
    const controllerStub = makeSut();
    // eslint-disable-next-line prefer-destructuring
    const entity = new PurchaseDAOImp()['entity'];
    jest.spyOn(entity, 'findUnique').mockImplementationOnce(jest.fn());

    const result = await controllerStub.handleGetPurchaseById('1' as unknown as number, 1);

    expect(result).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 403 if purchase.user_id is is different from userId', async () => {
    const controllerStub = makeSut();
    // eslint-disable-next-line prefer-destructuring
    const date = new Date();

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

    const result = await controllerStub.handleGetPurchaseById(1, 2);

    expect(result).toEqual(forbidden(new ForbiddenError('Você não tem permissão para acessar este conteúdo.')));
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
    const result = await controllerStub.handleGetPurchaseById(1, 1);

    expect(result.content).toEqual({ purchase });

    expect(result.statusCode).toEqual(200);
  });
});
