import { EmailValidatorAdapter } from '../../../../serverless/adapters/services/EmailValidatorAdapter';
import EncryptAdapter from '../../../../serverless/adapters/services/EncryptAdapter';
import WebTokenAdapter from '../../../../serverless/adapters/services/WebTokenAdapter';
import TokenController from '../../../../serverless/api/controllers/TokenController';
import { badRequest, HttpResponse, notFound, okWithPayload } from '../../../../serverless/api/helpers/http';
import UserModel from '../../../../serverless/data/models/UserModel';
import UserRepositoryMocked from '../../../mocks/mockUserRepository';

jest.mock('../../../mocks/mockUserRepository');

const makeEmailValidator = (): EmailValidatorAdapter => {
  class EmailValidatorStub implements EmailValidatorAdapter {
    isEmail(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

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
}

const makeEncrypter = (): EncryptAdapter => {
  class EncryptStub implements EncryptAdapter {
    encrypt(password: string): Promise<string> {
      throw new Error('Method not implemented.');
    }
    async compare(password: string, passHashed: string): Promise<boolean> {
      return await Promise.resolve(true);
    }
    
  }

  return new EncryptStub();
}

const makeSut = (): TokenController => {
  const emailValidatorStub = makeEmailValidator();
  const webTokenStub = makeWebToken();
  const encrypterStub = makeEncrypter()
  return new TokenController(emailValidatorStub, UserRepositoryMocked, webTokenStub, encrypterStub);
}


describe('Handle User Login Tests', () => {
  test('Should return 400 if no email is provided', async () => {
    const infos = {
      email: '',
      password: 'password',
    };
    const tokenController = makeSut();

    const httpResponse: HttpResponse = await tokenController.handleLogin(infos);

    expect(httpResponse).toEqual(badRequest('E-mail requerido (a).'));
  });

  test('Should return 400 if no password is provided', async () => {
    const infos = {
      email: 'email@email.com',
      password: '',
    };
    const tokenController = makeSut();

    const httpResponse: HttpResponse = await tokenController.handleLogin(infos);

    expect(httpResponse).toEqual(badRequest('Senha requerido (a).'));
  });

  test('Should return 404 if user not exists', async () => {
    const infos = {
      email: 'email@email.com',
      password: 'password',
    };
    jest.spyOn(UserRepositoryMocked, 'findByEmail').mockReturnValueOnce(Promise.resolve(undefined));
    const tokenController = makeSut();
    const httpResponse: HttpResponse = await tokenController.handleLogin(infos);

    expect(httpResponse).toEqual(notFound('Usuário não existente, considere criar uma conta.'));
  });

  test('Should return 400 if email is not valid', async () => {
    const infos = {
      email: 'email2email.com',
      password: 'password',
    };

    const emailValidatorStub = makeEmailValidator();
    const webTokenStub = makeWebToken();
    const encrypterStub =  makeEncrypter();
    
    jest.spyOn(emailValidatorStub, 'isEmail').mockReturnValueOnce(false);
    const tokenController = new TokenController(emailValidatorStub, UserRepositoryMocked, webTokenStub, encrypterStub);
    const httpResponse: HttpResponse = await tokenController.handleLogin(infos);

    expect(httpResponse).toEqual(badRequest('E-mail inválido.'));
  });

  test('Should return 400 if password is incorrect', async () => {
    const infos = {
      email: 'email@email.com',
      password: 'incorrect_password',
    };
    const emailValidatorStub = makeEmailValidator();
    const webTokenStub = makeWebToken();
    const encrypterStub =  makeEncrypter();
    
    jest.spyOn(encrypterStub, 'compare').mockImplementationOnce(async (): Promise<boolean> => {
      return await Promise.resolve(false);
    });
    const tokenController = new TokenController(emailValidatorStub, UserRepositoryMocked, webTokenStub, encrypterStub);
    const httpResponse: HttpResponse = await tokenController.handleLogin(infos);

    expect(httpResponse).toEqual(badRequest('Senha incorreta.'));
  });

  test('Should return 200 and user infos if success login ', async () => {
    const infos = {
      email: 'email@email.com',
      password: 'password',
    };

    const tokenController = makeSut();

    const httpResponse: HttpResponse = await tokenController.handleLogin(infos);

    expect(httpResponse).toEqual(okWithPayload('token' ,{
      name: 'name',
      email: 'email@email.com',
    }));
  });

  test('Should return 500 if server error ocurred', async () => {
    const infos = {
      email: 'email@email.com',
      password: 'password',
    };

    const tokenController = makeSut();

    const httpResponse: HttpResponse = await tokenController.handleLogin(infos);

    expect(httpResponse).toEqual(okWithPayload('token' ,{
      name: 'name',
      email: 'email@email.com',
    }));
  });
});