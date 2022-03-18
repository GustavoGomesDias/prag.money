/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { EmailValidatorAdapter } from '../../../../serverless/adapters/services/EmailValidatorAdapter';
import UserController from '../../../../serverless/api/controllers/User';
import {
  badRequest, okWithContent, okWithPayload, serverError,
} from '../../../../serverless/api/helpers/http';
import UserDAOImp from '../../../../serverless/DAOImp/users/UserDAOImp';
import UserModel from '../../../../serverless/data/models/UserModel';
import mockUserDAOImp from '../../../mocks/mockUserDAOImp';

jest.mock('../../../mocks/mockUserDAOImp');

afterEach(() => jest.clearAllMocks());

const makeEmailValidator = (): EmailValidatorAdapter => {
  class EmailValidatorStub implements EmailValidatorAdapter {
    isEmail(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): UserController => {
  const emailValidatorStub = makeEmailValidator();
  return new UserController(emailValidatorStub, mockUserDAOImp);
};

describe('Handle Get User By Id function', () => {
  test('Should return 500 if server returns a error', async () => {
    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());

    jest.spyOn(mockUserDAOImp, 'findUnique').mockImplementationOnce(async (info) => {
      throw new Error('Error');
    });

    const userController = makeSut();

    const response = await userController.handleGetUserById(1);

    expect(response).toEqual(serverError('Erro no servidor, tente novamente mais tarde.'));
  });

  test('Should return 400 if invalid user id is provided', async () => {
    jest.spyOn(mockUserDAOImp, 'findUnique').mockImplementationOnce(async (info) => {
      const result = Promise.resolve({
        id: 1,
        email: 'email@email.com',
        name: 'name',
        password: 'hash',
        payment: [{
          id: 1,
          nickname: 'nick',
          default_value: 800,
          reset_day: 1,
          user_dya: 1,
        }],
      });

      return result;
    });

    const userController = makeSut();

    const response = await userController.handleGetUserById(-1);

    expect(response).toEqual(badRequest('Id de usuário inválido.'));
  });

  test('Should return 200 if user is returned', async () => {
    const user = {
      id: 1,
      email: 'email@email.com',
      name: 'name',
    };
    jest.spyOn(mockUserDAOImp, 'findUnique').mockImplementationOnce(async (info) => {
      const result = Promise.resolve({
        id: 1,
        email: 'email@email.com',
        name: 'name',
      });

      return result;
    });

    const userController = makeSut();

    const response = await userController.handleGetUserById(1);

    expect(response).toEqual(okWithContent(user as unknown as Omit<UserModel, 'password'>));
  });
});
