import { PrismaClient } from '@prisma/client';
import { EmailValidatorAdapter } from '../../../../serverless/adapters/services/EmailValidatorAdapter';
import UserController from '../../../../serverless/api/controllers/User';
import { badRequest, HttpResponse, ok } from '../../../../serverless/api/helpers/http';
import UserRepositoryMocked from '../../../mocks/mockUserRepository';

const prisma = new PrismaClient();

jest.mock('../../../mocks/mockUserRepository');

const makeEmailValidator = (): EmailValidatorAdapter => {
  class EmailValidatorStub implements EmailValidatorAdapter {
    isEmail(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

const makeSut = (): UserController => {
  const emailValidatorStub = makeEmailValidator();
  return new UserController(emailValidatorStub, UserRepositoryMocked);
}

afterAll(async () => {
  prisma.$disconnect();
});

describe('Handle User Register test', () => {
  test('Should return 400 if no name is provided', async () => {
    const httpRequest = {
      body: {
        user: {
          name: '',
          email: 'email@email.com',
          password: 'password',
          passwordConfirmation: 'password',
        }
      },
    };
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual(badRequest('Nome requerido (a).'));
  });
  
  test('Should return 400 if no email is provided', async () => {
    const httpRequest = {
      body: {
        user: {
          name: 'name',
          email: '',
          password: 'password',
          passwordConfirmation: 'password',
        }
      },
    };
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual(badRequest('E-mail requerido (a).'));
  });

  test('Should return 400 if no password is provided', async () => {
    const httpRequest = {
      body: {
        user: {
          name: 'name',
          email: 'email@email.com',
          password: '',
          passwordConfirmation: 'password',
        }
      },
    };
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual(badRequest('Senha requerido (a).'));
  });

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const httpRequest = {
      body: {
        user: {
          name: 'name',
          email: 'email@email.com',
          password: 'password',
          passwordConfirmation: '',
        }
      },
    };
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual(badRequest('Confirmação de senha requerido (a).'));
  });

  test('Should return 400 if no password is provided', async () => {
    const httpRequest = {
      body: {
        user: {
          name: 'name',
          email: 'email@email.com',
          password: '',
          passwordConfirmation: 'password',
        }
      },
    };
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual(badRequest('Senha requerido (a).'));
  });

  test('Should return 400 if password not equals passwordConfirmation', async () => {
    const httpRequest = {
      body: {
        user: {
          name: 'name',
          email: 'email@email.com',
          password: 'password',
          passwordConfirmation: 'pass',
        }
      },
    };
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual(badRequest('Senha diferente de confirmar senha.'));
  });

  test('Should return 400 if email is not valid', async () => {
    const httpRequest = {
      body: {
        user: {
          name: 'name',
          email: 'invalid_email2email,com',
          password: 'password',
          passwordConfirmation: 'password',
        }
      },
    };

    const emailValidatorStub = makeEmailValidator();
    jest.spyOn(emailValidatorStub, 'isEmail').mockReturnValueOnce(false);
    const userController = new UserController(emailValidatorStub, UserRepositoryMocked)

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual(badRequest('E-mail inválido.'));
  });

  test('Should return 200 if user is creted', async () => {
    const httpRequest = {
      body: {
        user: {
          name: 'name',
          email: 'email@email.com',
          password: 'password',
          passwordConfirmation: 'password',
        }
      },
    };

    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual(ok('Usuário criado com sucesso!'));
  });
});