import { PrismaClient } from '@prisma/client';
import { EmailValidatorAdapter } from '../../../../serverless/adapters/services/EmailValidatorAdapter';
import EncryptAdapter from '../../../../serverless/adapters/services/EncryptAdapter';
import UserController, { HttpResponse } from '../../../../serverless/api/controllers/User';

const prisma = new PrismaClient();

const makeEncrypter = (): EncryptAdapter => {
  class EncrypterStub implements EncryptAdapter {
    async encrypt(password: string): Promise<string> {
      return new Promise((resolve) => resolve('hash'));
    }
  }

  return new EncrypterStub();
}

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
  const encrypterStub = makeEncrypter();

  return new UserController(emailValidatorStub, encrypterStub);
}

afterEach(async () => {
  const user = await prisma.user.findUnique({
    where: {
      email: 'email@email.com',
    }
  })

  if (user){
    await prisma.user.delete({
      where: {
        email: 'email@email.com', 
      },
    });
  }
});

afterAll(async () => {
  const user = await prisma.user.findUnique({
    where: {
      email: 'email@email.com',
    }
  })

  if (user){
    await prisma.user.delete({
      where: {
        email: 'email@email.com', 
      },
    });
  }

  prisma.$disconnect();
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
    const userController = makeSut();

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
    const userController = makeSut();

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
    const userController = makeSut();

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
    const userController = makeSut();

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
    const userController = makeSut();

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
    const userController = makeSut();

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

    const emailValidatorStub = makeEmailValidator();
    const encrypterStub = makeEncrypter();
    jest.spyOn(emailValidatorStub, 'isEmail').mockReturnValueOnce(false);
    const userController = new UserController(emailValidatorStub, encrypterStub)

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

    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 200,
      message: 'Usuário criado com sucesso!'
    })
  });
});