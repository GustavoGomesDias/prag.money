/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Prisma, PrismaClient } from '@prisma/client';
import { EmailValidatorAdapter } from '../../../../serverless/adapters/services/EmailValidatorAdapter';
import UserController from '../../../../serverless/api/controllers/User';
import {
  badRequest, created, HttpResponse, serverError,
} from '../../../../serverless/api/helpers/http';
import mockUserDAOImp from '../../../mocks/mockUserDAOImp';

const prisma = new PrismaClient();

jest.mock('../../../mocks/mockUserDAOImp');

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
        },
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
        },
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
        },
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
        },
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
        },
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
        },
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
        },
      },
    };

    const emailValidatorStub = makeEmailValidator();

    jest.spyOn(emailValidatorStub, 'isEmail').mockReturnValueOnce(false);
    const userController = new UserController(emailValidatorStub, mockUserDAOImp);

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual(badRequest('E-mail inválido.'));
  });

  test('Should return 400 if unique field (email) already existis', async () => {
    const httpRequest = {
      body: {
        user: {
          name: 'name',
          email: 'already_existis@email.com',
          password: 'password',
          passwordConfirmation: 'password',
        },
      },
    };

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(mockUserDAOImp, 'addUser').mockImplementationOnce(async () => {
      throw new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (`email`)', 'P2002', '3.9.1');
    });
    const userControllerStub = makeSut();

    const response = await userControllerStub.handleRegister(httpRequest);

    expect(response).toEqual(badRequest('Email já existe, tente novamente.'));
  });

  test('Should return 500 if server returns a error', async () => {
    const httpRequest = {
      body: {
        user: {
          name: 'name',
          email: 'already_existis@email.com',
          password: 'password',
          passwordConfirmation: 'password',
        },
      },
    };

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(mockUserDAOImp, 'addUser').mockImplementationOnce(async () => {
      throw new Error('Server Error');
    });
    const userControllerStub = makeSut();

    const response = await userControllerStub.handleRegister(httpRequest);

    expect(response).toEqual(serverError('Erro no servidor, tente novamente mais tarde'));
  });

  test('Should return 200 if user is created', async () => {
    const httpRequest = {
      body: {
        user: {
          name: 'name',
          email: 'email@email.com',
          password: 'password',
          passwordConfirmation: 'password',
        },
      },
    };

    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual(created('Usuário criado com sucesso!'));
  });
});
