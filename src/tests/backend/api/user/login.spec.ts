import { EmailValidatorAdapter } from '../../../../serverless/adapters/services/EmailValidatorAdapter';
import UserController from '../../../../serverless/api/controllers/User';
import { badRequest, HttpResponse, notFound } from '../../../../serverless/api/helpers/http';
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

const makeSut = (): UserController => {
  const emailValidatorStub = makeEmailValidator();
  return new UserController(emailValidatorStub, UserRepositoryMocked);
}


describe('Handle User Login Tests', () => {
  test('Should return 400 if no email is provided', async () => {
    const infos = {
      email: '',
      password: 'password',
    };
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleLogin(infos);

    expect(httpResponse).toEqual(badRequest('E-mail requerido (a).'));
  });

  test('Should return 400 if no password is provided', async () => {
    const infos = {
      email: 'email@email.com',
      password: '',
    };
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleLogin(infos);

    expect(httpResponse).toEqual(badRequest('Senha requerido (a).'));
  });

  test('Should return 404 if user not exists', async () => {
    const infos = {
      email: 'email@email.com',
      password: 'password',
    };
    jest.spyOn(UserRepositoryMocked, 'findByEmail').mockReturnValueOnce(Promise.resolve(undefined));
    const userController = makeSut();
    const httpResponse: HttpResponse = await userController.handleLogin(infos);

    expect(httpResponse).toEqual(notFound('Usuário não existente, considere criar uma conta.'));
  });

  test('Should return 400 if password is incorrect', async () => {
    const infos = {
      email: 'email@email.com',
      password: 'incorrect_password',
    };
    const userController = makeSut();
    const httpResponse: HttpResponse = await userController.handleLogin(infos);

    expect(httpResponse).toEqual(badRequest('Senha incorreta.'));
  });
});