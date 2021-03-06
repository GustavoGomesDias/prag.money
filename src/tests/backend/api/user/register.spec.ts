/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Prisma, PrismaClient } from '@prisma/client';
import { EmailValidatorAdapter } from '../../../../serverless/adapters/services/EmailValidatorAdapter';
import UserController from '../../../../serverless/api/controllers/User';
import {
  badRequest, created, HttpResponse, serverError,
} from '../../../../serverless/api/helpers/http';
import RegisterUser from '../../../../serverless/data/usecases/RegisterUser';
import { BadRequestError, InternalServerError } from '../../../../serverless/error/HttpError';
import mockUserDAOImp from '../../../mocks/mockUserDAOImp';

const prisma = new PrismaClient();

jest.mock('../../../mocks/mockUserDAOImp');
afterAll(() => jest.restoreAllMocks());

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
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister({
      name: '',
      email: 'email@email.com',
      password: 'password',
      passwordConfirmation: 'password',
    });

    expect(httpResponse).toEqual(badRequest(new BadRequestError('Nome de usuário requerido.')));
  });

  test('Should return 400 if no email is provided', async () => {
    const user: RegisterUser = {
      name: 'name',
      email: '',
      password: 'password',
      passwordConfirmation: 'password',
    };
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister(user);

    expect(httpResponse).toEqual(badRequest(new BadRequestError('E-mail requerido.')));
  });

  test('Should return 400 if no password is provided', async () => {
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister({
      name: 'name',
      email: 'email@email.com',
      password: '',
      passwordConfirmation: 'password',
    });

    expect(httpResponse).toEqual(badRequest(new BadRequestError('Senha requerida.')));
  });

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister({
      name: 'name',
      email: 'email@email.com',
      password: 'password',
      passwordConfirmation: '',
    });

    expect(httpResponse).toEqual(badRequest(new BadRequestError('Confirmação de senha requerida.')));
  });

  test('Should return 400 if no password is provided', async () => {
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister({
      name: 'name',
      email: 'email@email.com',
      password: '',
      passwordConfirmation: 'password',
    });

    expect(httpResponse).toEqual(badRequest(new BadRequestError('Senha requerida.')));
  });

  test('Should return 400 if password not equals passwordConfirmation', async () => {
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister({
      name: 'name',
      email: 'email@email.com',
      password: 'password',
      passwordConfirmation: 'pass',
    });

    expect(httpResponse).toEqual(badRequest(new BadRequestError('Senha diferente de confirmar senha.')));
  });

  test('Should return 400 if email is not valid', async () => {
    const emailValidatorStub = makeEmailValidator();

    jest.spyOn(emailValidatorStub, 'isEmail').mockReturnValueOnce(false);
    const userController = new UserController(emailValidatorStub, mockUserDAOImp);

    const httpResponse: HttpResponse = await userController.handleRegister({
      name: 'name',
      email: 'invalid_email2email,com',
      password: 'password',
      passwordConfirmation: 'password',
    });

    expect(httpResponse).toEqual(badRequest(new BadRequestError('E-mail inválido.')));
  });

  test('Should return 400 if unique field (email) already existis', async () => {
    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(mockUserDAOImp, 'addUser').mockImplementationOnce(async () => {
      throw new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (`email`)', 'P2002', '3.9.1');
    });
    const userControllerStub = makeSut();

    const response = await userControllerStub.handleRegister({
      name: 'name',
      email: 'already_existis@email.com',
      password: 'password',
      passwordConfirmation: 'password',
    });

    expect(response).toEqual(badRequest(new BadRequestError('Email já existe, tente novamente.')));
  });

  test('Should return 500 if server returns a error', async () => {
    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(mockUserDAOImp, 'addUser').mockImplementationOnce(async () => {
      throw new Error('Server Error');
    });
    const userControllerStub = makeSut();

    const response = await userControllerStub.handleRegister({
      name: 'name',
      email: 'email@email.com',
      password: 'password',
      passwordConfirmation: 'password',
    });

    expect(response).toEqual(serverError(new InternalServerError('Erro no servidor, tente novamente mais tarde.')));
  });

  test('Should return 200 if user is created', async () => {
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister({
      name: 'name',
      email: 'email@email.com',
      password: 'password',
      passwordConfirmation: 'password',
    });

    expect(httpResponse).toEqual(created('Usuário criado com sucesso!'));
  });
});
