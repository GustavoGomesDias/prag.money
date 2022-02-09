import { PrismaClient } from '@prisma/client';
import { EmailValidatorAdapter } from '../../../../serverless/adapters/services/EmailValidatorAdapter';
import UserController, { HttpResponse } from '../../../../serverless/api/controllers/User';

const makeEmailValidator = (): EmailValidatorAdapter => {
  class EmailValidatorStub implements EmailValidatorAdapter {
    isEmail(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

afterAll(async () => {
  const prisma = new PrismaClient();
  await prisma.user.delete({
    where: {
      email: 'email@email.com', 
    },
  });
});

describe('Handle Register test', () => {
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

    const emailValidator = makeEmailValidator();
    const userController = new UserController(emailValidator);

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 400,
      message: 'Nome requerido (a).',
    })
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

    const emailValidator = makeEmailValidator();
    const userController = new UserController(emailValidator);

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 400,
      message: 'E-mail requerido (a).',
    })
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

    const emailValidator = makeEmailValidator();
    const userController = new UserController(emailValidator);

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 400,
      message: 'Senha requerido (a).',
    })
  });

  test('Should return 400 if no password is provided', async () => {
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

    const emailValidator = makeEmailValidator();
    const userController = new UserController(emailValidator);

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 400,
      message: 'Confirmação de senha requerido (a).',
    })
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

    const emailValidator = makeEmailValidator();
    const userController = new UserController(emailValidator);

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 400,
      message: 'Senha requerido (a).',
    })
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

    const emailValidator = makeEmailValidator();
    const userController = new UserController(emailValidator);

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 400,
      message: 'Senha diferente de confirmar senha.',
    })
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

    const emailValidator = makeEmailValidator();
    jest.spyOn(emailValidator, 'isEmail').mockReturnValueOnce(false);
    const userController = new UserController(emailValidator);

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 400,
      message: 'E-mail inválido.',
    })
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

    const emailValidator = makeEmailValidator();
    const userController = new UserController(emailValidator);

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 200,
      message: 'Usuário criado com sucesso!'
    })
  });
});