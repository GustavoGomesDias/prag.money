/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable dot-notation */
import PaymentController from '../../../../serverless/api/controllers/PaymentController';
import { badRequest, ok, okWithContent } from '../../../../serverless/api/helpers/http';
import PaymentDAOImp from '../../../../serverless/DAOImp/payment/PaymentDAOImp';
import PaymentModel from '../../../../serverless/data/models/PaymentModel';
import { BadRequestError } from '../../../../serverless/error/HttpError';
import * as validations from '../../../../serverless/api/helpers/Validations';

const makeSut = (): PaymentController => {
  const daoIMP = new PaymentDAOImp();
  const controllerStub = new PaymentController(daoIMP);
  return controllerStub;
};

afterAll(() => jest.restoreAllMocks());

describe('Handle Get By Payment Id', () => {
  test('Should return 400 if invalid user id is provided', async () => {
    const controllerStub = makeSut();
    // eslint-disable-next-line prefer-destructuring
    const entity = new PaymentDAOImp()['entity'];
    jest.spyOn(entity, 'findUnique').mockImplementationOnce(jest.fn());
    jest.spyOn(validations, 'checkIsEquals403Error').mockImplementationOnce(jest.fn());

    const result = await controllerStub.handleGetPaymentById(-1, 1);

    expect(result).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 400 if user id is string', async () => {
    const controllerStub = makeSut();
    // eslint-disable-next-line prefer-destructuring
    const entity = new PaymentDAOImp()['entity'];
    jest.spyOn(entity, 'findUnique').mockImplementationOnce(jest.fn());
    jest.spyOn(validations, 'checkIsEquals403Error').mockImplementationOnce(jest.fn());

    const result = await controllerStub.handleGetPaymentById('1' as unknown as number, 1);

    expect(result).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 400 if user id is string and converted to number', async () => {
    const controllerStub = makeSut();
    // eslint-disable-next-line prefer-destructuring
    const entity = new PaymentDAOImp()['entity'];
    jest.spyOn(entity, 'findUnique').mockImplementationOnce(jest.fn());
    jest.spyOn(validations, 'checkIsEquals403Error').mockImplementationOnce(jest.fn());

    const result = await controllerStub.handleGetPaymentById(Number('aa'), 1);

    expect(result).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 200 with content if get payment it happened successfully', async () => {
    const payment: Omit<PaymentModel, 'current_month'> = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: 1,
      user_id: 1,
    };
    // eslint-disable-next-line prefer-destructuring
    jest.spyOn(PaymentDAOImp.prototype, 'findUnique').mockImplementationOnce(async (info) => {
      const result = await Promise.resolve({
        nickname: 'nickname',
        default_value: 800,
        reset_day: 1,
        user_id: 1,
      });

      return result;
    });

    const controllerStub = makeSut();
    const result = await controllerStub.handleGetPaymentById(1, 1);

    expect(result.content).toEqual({ payment });

    expect(result.statusCode).toEqual(200);
  });
});
