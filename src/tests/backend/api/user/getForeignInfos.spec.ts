/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { EmailValidatorAdapter } from '../../../../serverless/adapters/services/EmailValidatorAdapter';
import UserController from '../../../../serverless/api/controllers/User';
import {
  badRequest, notFound, okWithContent, serverError,
} from '../../../../serverless/api/helpers/http';
import UserDAOImp from '../../../../serverless/DAOImp/users/UserDAOImp';
import { BadRequestError, InternalServerError, NotFoundError } from '../../../../serverless/error/HttpError';
import makePaymentController, {} from '../../../../serverless/factories/users/UserFacotory';
import GenericDAOImp from '../../../../serverless/infra/DAO/GenericDAOImp';
import { mockPayment, mockPaymentWithArray, mockPurchase } from '../../../mocks/mockForeignInfos';
import mockUserDAOImp from '../../../mocks/mockUserDAOImp';

const makeSut = (): UserController => makePaymentController();

afterAll(() => jest.clearAllMocks());

describe('Handle Get Payments Function', () => {
  const purchaseDate = new Date('2022-05-20T18:33:18.189Z');

  test('Should return 200 if payments infos is returned (PayWith is array)', async () => {
    jest.spyOn(Date.prototype, 'getMonth').mockImplementationOnce(() => 5);

    const { current_value, ...rest } = mockPaymentWithArray;
    jest.spyOn(GenericDAOImp.prototype, 'findUnique').mockReturnValueOnce(Promise.resolve({
      Payment: {
        current_value: current_value - 1,
        ...rest,
      },
      Purchase: mockPurchase,
    }));

    const userController = makeSut();

    const response = await userController.handleGetPaymentsByUserId(1);

    expect(response).toEqual(okWithContent({
      payments: [{
        nickname: 'nickname',
        default_value: 800,
        current_value: 4,
        reset_day: Number(purchaseDate.getDate()),
        user_id: 1,
        PayWith: [{
          payment_id: 1,
          purchase_id: 1,
          value: 1,
          purchase: {
            created_at: purchaseDate.toISOString(),
          },
        }],
      }],
    }));
  });

  test('Should return 200 if payments infos is returned (PayWith not is array)', async () => {
    jest.spyOn(Date.prototype, 'getMonth').mockImplementationOnce(() => 5);
    const { current_value, ...rest } = mockPaymentWithArray;
    jest.spyOn(GenericDAOImp.prototype, 'findUnique').mockReturnValueOnce(Promise.resolve({
      Payment: {
        current_value: current_value - 1,
        ...rest,
      },
      Purchase: mockPurchase,
    }));

    const userController = makeSut();

    const response = await userController.handleGetPaymentsByUserId(1);

    expect(response).toEqual(okWithContent({
      payments: [{
        nickname: 'nickname',
        default_value: 800,
        current_value: 4,
        reset_day: Number(purchaseDate.getDate()),
        user_id: 1,
        PayWith: [{
          payment_id: 1,
          purchase_id: 1,
          value: 1,
          purchase: {
            created_at: purchaseDate.toISOString(),
          },
        }],
      }],
    }));
  });

  test('Should return 404 if payments infos is undefined', async () => {
    jest.spyOn(GenericDAOImp.prototype, 'findUnique').mockReturnValueOnce(Promise.resolve({
      Payment: undefined,
    }));

    const userController = makeSut();

    const response = await userController.handleGetPaymentsByUserId(1);

    expect(response).toEqual(notFound(new NotFoundError('Não há formas de pagamento cadastradas.')));
  });

  test('Should return 500 if server returns a error', async () => {
    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());

    jest.spyOn(UserDAOImp.prototype, 'getAllForeignInfosByUserId').mockImplementationOnce(async (info) => {
      throw new Error('Error');
    });

    const userController = makeSut();

    const response = await userController.handleGetPaymentsByUserId(1);

    expect(response).toEqual(serverError(new InternalServerError('Erro no servidor, tente novamente mais tarde.')));
  });

  test('Should return 400 if invalid user id is provided', async () => {
    jest.spyOn(mockUserDAOImp, 'findUnique').mockImplementationOnce(async (info) => {
      const result = await Promise.resolve({
        payments: [{
          nickname: 'nickname',
          default_value: 800,
          reset_day: 1,
          user_id: 1,
        }],
        purchases: [{
          id: 1,
          value: 800,
          description: 'description',
          purchase_date: purchaseDate,
          user_id: 1,
        }],
      });

      return result;
    });

    const userController = makeSut();

    const response = await userController.handleGetPaymentsByUserId(-1);

    expect(response).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 400 if user id is string', async () => {
    jest.spyOn(mockUserDAOImp, 'findUnique').mockImplementationOnce(async (info) => {
      const result = await Promise.resolve({
        payments: [{
          nickname: 'nickname',
          default_value: 800,
          reset_day: 1,
          user_id: 1,
        }],
        purchases: [{
          id: 1,
          value: 800,
          description: 'description',
          purchase_date: purchaseDate,
          user_id: 1,
        }],
      });

      return result;
    });

    const userController = makeSut();

    const response = await userController.handleGetPaymentsByUserId('1' as unknown as number);

    expect(response).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 400 if user id is string and converted to number', async () => {
    jest.spyOn(mockUserDAOImp, 'findUnique').mockImplementationOnce(async (info) => {
      const result = await Promise.resolve({
        payments: [{
          nickname: 'nickname',
          default_value: 800,
          reset_day: 1,
          user_id: 1,
        }],
        purchases: [{
          id: 1,
          value: 800,
          description: 'description',
          purchase_date: purchaseDate,
          user_id: 1,
        }],
      });

      return result;
    });

    const userController = makeSut();

    const response = await userController.handleGetPaymentsByUserId(Number('aa'));

    expect(response).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 404 if invalid user not exists', async () => {
    jest.spyOn(UserDAOImp.prototype, 'findUnique').mockReturnValueOnce(Promise.resolve([null]));

    const userController = makeSut();

    const response = await userController.handleGetPaymentsByUserId(1);

    expect(response).toEqual(notFound(new NotFoundError('Não há formas de pagamento cadastradas.')));
  });
});
