/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { EmailValidatorAdapter } from '../../../../serverless/adapters/services/EmailValidatorAdapter';
import UserController from '../../../../serverless/api/controllers/User';
import { badRequest } from '../../../../serverless/api/helpers/http';
import UserDAOImp from '../../../../serverless/DAOImp/users/UserDAOImp';
import makePaymentController, {} from '../../../../serverless/factories/users/UserFacotory';
import mockUserDAOImp from '../../../mocks/mockUserDAOImp';

const makeSut = (): UserController => makePaymentController();

describe('Handle Get Payments Function', () => {
  const purchaseDate = new Date();

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

    expect(response).toEqual(badRequest('Id de usuário inválido.'));
  });

  test('Should return 400 if invalid user not exists', async () => {
    jest.spyOn(UserDAOImp.prototype, 'findUnique').mockImplementationOnce(async (info) => {
      const result = await Promise.resolve(null);

      return result;
    });

    const userController = makeSut();

    const response = await userController.handleGetPaymentsByUserId(1);

    expect(response).toEqual(badRequest('Não a formas de pagamento cadastradas.'));
  });
});
