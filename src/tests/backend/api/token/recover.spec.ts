/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { EmailValidatorAdapter } from '../../../../serverless/adapters/services/EmailValidatorAdapter';
import EncryptAdapter from '../../../../serverless/adapters/services/EncryptAdapter';
import WebTokenAdapter from '../../../../serverless/adapters/services/WebTokenAdapter';
import TokenController from '../../../../serverless/api/controllers/TokenController';
import {
  badRequest, HttpResponse, notFound, okWithPayload, serverError,
} from '../../../../serverless/api/helpers/http';
import PaymentDAOImp from '../../../../serverless/DAOImp/payment/PaymentDAOImp';
import UserModel from '../../../../serverless/data/models/UserModel';
import { BadRequestError, InternalServerError, NotFoundError } from '../../../../serverless/error/HttpError';
import { TokenExpired } from '../../../../serverless/error/PMoneyErrors';
import JWTService from '../../../../serverless/services/JWTService';
import mockUserDAOImp from '../../../mocks/mockUserDAOImp';

afterAll(() => jest.restoreAllMocks());

const makeEmailValidator = (): EmailValidatorAdapter => {
  class EmailValidatorStub implements EmailValidatorAdapter {
    isEmail(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeWebToken = (): WebTokenAdapter => {
  class WebTokenStub implements WebTokenAdapter {
    sign(payload: Omit<UserModel, 'password'>, expiresIn: string | number): string {
      return 'token';
    }

    verify(token: string): Omit<UserModel, 'password'> {
      return {
        id: 1,
        email: 'email@email.com',
        name: 'name',
      };
    }
  }

  return new WebTokenStub();
};

const makeEncrypter = (): EncryptAdapter => {
  class EncryptStub implements EncryptAdapter {
    encrypt(password: string): Promise<string> {
      throw new Error('Method not implemented.');
    }

    async compare(password: string, passHashed: string): Promise<boolean> {
      const result = await Promise.resolve(true);
      return result;
    }
  }

  return new EncryptStub();
};

const makeSut = (): TokenController => {
  const emailValidatorStub = makeEmailValidator();
  const webTokenStub = makeWebToken();
  const encrypterStub = makeEncrypter();
  const paymentDAOStub = new PaymentDAOImp();
  return new TokenController(emailValidatorStub, mockUserDAOImp, webTokenStub, encrypterStub, paymentDAOStub);
};

describe('Handle Recovering User Infos', () => {
  test('Should return 400 if no token is provided', async () => {
    const token = '';
    const tokenController = makeSut();

    const response = await tokenController.handleRecoverUserInfos(token);

    expect(response).toEqual(badRequest(new BadRequestError('Não foi encontrado nenhum Token.')));
  });

  test('Should return 400 if token is expired', async () => {
    const token = 'token';
    const webTokenStub = new JWTService();

    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new TokenExpired();
    });

    const emailValidatorStub = makeEmailValidator();
    const encrypterStub = makeEncrypter();
    const paymentDAOStub = new PaymentDAOImp();

    const tokenController = new TokenController(emailValidatorStub, mockUserDAOImp, webTokenStub, encrypterStub, paymentDAOStub);

    const response = await tokenController.handleRecoverUserInfos(token);

    expect(response).toEqual(badRequest(new BadRequestError('Token expirou. Faça login novamente.')));
  });

  test('Should return 404 if token id no return a user', async () => {
    const token = 'token';
    const webTokenStub = makeWebToken();
    const emailValidatorStub = makeEmailValidator();
    const encrypterStub = makeEncrypter();
    const paymentDAOStub = new PaymentDAOImp();
    jest.spyOn(mockUserDAOImp, 'findUnique').mockResolvedValueOnce(await Promise.resolve(undefined));
    const tokenController = new TokenController(emailValidatorStub, mockUserDAOImp, webTokenStub, encrypterStub, paymentDAOStub);

    const response = await tokenController.handleRecoverUserInfos(token);

    expect(response).toEqual(notFound(new NotFoundError('Usuário não existe.')));
  });

  test('Should return 500 if server error ocurred ', async () => {
    const token = 'token';

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(mockUserDAOImp, 'findUnique').mockImplementationOnce(async () => {
      throw new Error('Server Error');
    });

    const tokenController = makeSut();
    const httpResponse: HttpResponse = await tokenController.handleRecoverUserInfos(token);

    expect(httpResponse).toEqual(serverError(new InternalServerError('Erro no servidor, tente novamente mais tarde.')));
  });

  test('Should return 200 and user infos if success recovering user infos', async () => {
    const token = 'token';

    const tokenController = makeSut();
    const response = await tokenController.handleRecoverUserInfos(token);

    expect(response).toEqual(okWithPayload(response.payload as string, {
      id: response.userInfo?.userInfo.id,
      email: response.userInfo?.userInfo.email as string,
      name: response.userInfo?.userInfo.name as string,
    }));
  });
});
