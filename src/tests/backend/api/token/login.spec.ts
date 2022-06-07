/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { EmailValidatorAdapter } from '../../../../serverless/adapters/services/EmailValidatorAdapter';
import EncryptAdapter from '../../../../serverless/adapters/services/EncryptAdapter';
import WebTokenAdapter from '../../../../serverless/adapters/services/WebTokenAdapter';
import TokenController from '../../../../serverless/api/controllers/TokenController';
import {
  badRequest, HttpResponse, notFound, okWithPayload, serverError,
} from '../../../../serverless/api/helpers/http';
import PaymentDAOImp from '../../../../serverless/DAOImp/payment/PaymentDAOImp';
import UserDAOImp from '../../../../serverless/DAOImp/users/UserDAOImp';
import UserModel from '../../../../serverless/data/models/UserModel';
import { BadRequestError, InternalServerError, NotFoundError } from '../../../../serverless/error/HttpError';
import GenericDAOImp from '../../../../serverless/infra/DAO/GenericDAOImp';
import EmailValidator from '../../../../serverless/services/EmailValidator';
import returnPurchaseInfos from '../../../mocks/acquisitons/mockPurchasesInfos';
import { mockPaymentWithArray } from '../../../mocks/mockForeignInfos';
import mockUserDAOImp from '../../../mocks/mockUserDAOImp';

jest.mock('../../../mocks/mockUserDAOImp');
afterAll(() => jest.resetAllMocks());

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
      throw new Error('Method not implemented.');
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
  const userDAOStub = new UserDAOImp(encrypterStub);
  return new TokenController(emailValidatorStub, userDAOStub, webTokenStub, encrypterStub, paymentDAOStub);
};

describe('Handle User Login Tests', () => {
  test('Should return 400 if no email is provided', async () => {
    const infos = {
      email: '',
      password: 'password',
    };
    const tokenController = makeSut();
    const httpResponse: HttpResponse = await tokenController.handleLogin(infos);

    expect(httpResponse).toEqual(badRequest(new BadRequestError('E-mail requerido.')));
  });

  test('Should return 400 if no password is provided', async () => {
    const infos = {
      email: 'email@email.com',
      password: '',
    };
    const tokenController = makeSut();

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    const httpResponse: HttpResponse = await tokenController.handleLogin(infos);

    expect(httpResponse).toEqual(badRequest(new BadRequestError('Senha requerida.')));
  });

  test('Should return 404 if user not exists', async () => {
    const infos = {
      email: 'email@email.com',
      password: 'password',
    };
    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    const emailValidatorStub = makeEmailValidator();
    const encrypterStub = makeEncrypter();
    const webTokenStub = makeWebToken();
    const paymentDAO = new PaymentDAOImp();
    const tokenController = new TokenController(emailValidatorStub, new UserDAOImp(encrypterStub), webTokenStub, encrypterStub, paymentDAO);
    jest.spyOn(GenericDAOImp.prototype, 'findUnique').mockReturnValueOnce(Promise.resolve(undefined));
    const httpResponse: HttpResponse = await tokenController.handleLogin(infos);

    expect(httpResponse).toEqual(notFound(new NotFoundError('Usuário não existente, considere criar uma conta.')));
  });

  test('Should return 400 if email is not valid', async () => {
    const infos = {
      email: 'email2email.com',
      password: 'password',
    };

    const emailValidatorStub = makeEmailValidator();
    const webTokenStub = makeWebToken();
    const encrypterStub = makeEncrypter();
    const paymentDAO = new PaymentDAOImp();

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(emailValidatorStub, 'isEmail').mockReturnValue(false);
    const tokenController = new TokenController(emailValidatorStub, mockUserDAOImp, webTokenStub, encrypterStub, paymentDAO);
    const httpResponse: HttpResponse = await tokenController.handleLogin(infos);

    expect(httpResponse).toEqual(badRequest(new BadRequestError('E-mail inválido.')));
  });

  test('Should return 400 if password is incorrect', async () => {
    const infos = {
      email: 'email@email.com',
      password: 'incorrect_password',
    };
    const emailValidatorStub = makeEmailValidator();
    const webTokenStub = makeWebToken();
    const encrypterStub = makeEncrypter();
    const paymentDAO = new PaymentDAOImp();

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(encrypterStub, 'compare').mockImplementationOnce(async (): Promise<boolean> => {
      const result = await Promise.resolve(false);
      return result;
    });
    const tokenController = new TokenController(emailValidatorStub, mockUserDAOImp, webTokenStub, encrypterStub, paymentDAO);
    const httpResponse: HttpResponse = await tokenController.handleLogin(infos);

    expect(httpResponse).toEqual(badRequest(new BadRequestError('E-mail ou senhas incorretos.')));
  });

  test('Should return 500 if server error ocurred ', async () => {
    const infos = {
      email: 'email@email.com',
      password: 'password',
    };

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(UserDAOImp.prototype, 'findByEmail').mockImplementationOnce(async () => {
      throw new Error('Server Error');
    });

    const tokenController = makeSut();
    const httpResponse: HttpResponse = await tokenController.handleLogin(infos);

    expect(httpResponse).toEqual(serverError(new InternalServerError('Erro no servidor, tente novamente mais tarde.')));
  });

  test('Should return 200 and user infos if success login', async () => {
    const infos = {
      email: 'email@email.com',
      password: 'password',
    };

    jest.spyOn(UserDAOImp.prototype, 'findUnique').mockImplementationOnce(async (info) => {
      const result = await Promise.resolve({
        id: 1,
        email: 'email@email.com',
        name: 'name',
      });

      return result;
    });

    jest.spyOn(UserDAOImp.prototype, 'getAllForeignInfosByUserId').mockImplementationOnce(async (info) => {
      const { PayWith, ...rest } = mockPaymentWithArray;
      const result = await Promise.resolve({
        payments: [{
          ...rest,
          current_month: 1,
          PayWith: [],
        }],
        purchases: [returnPurchaseInfos(new Date(Date.now()))],
      });

      return result;
    });

    jest.spyOn(TokenController.prototype, 'resolveMonthBalance').mockImplementationOnce(jest.fn());

    const tokenController = makeSut();

    const httpResponse: HttpResponse = await tokenController.handleLogin(infos);

    expect(httpResponse).toEqual(okWithPayload('token', {
      id: 1,
      name: 'name',
      email: 'email@email.com',
    }));
  });
});
