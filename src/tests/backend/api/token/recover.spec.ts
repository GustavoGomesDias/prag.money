import { TokenExpiredError } from "jsonwebtoken";
import { EmailValidatorAdapter } from "../../../../serverless/adapters/services/EmailValidatorAdapter";
import EncryptAdapter from "../../../../serverless/adapters/services/EncryptAdapter";
import WebTokenAdapter from "../../../../serverless/adapters/services/WebTokenAdapter";
import TokenController from "../../../../serverless/api/controllers/TokenController";
import { badRequest, notFound, okWithPayload } from "../../../../serverless/api/helpers/http";
import UserModel from "../../../../serverless/data/models/UserModel";
import UserRepositoryMocked from "../../../mocks/mockUserRepository";

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
      return {
        id: 1,
        email: 'email@email.com',
        name: 'name',
      }
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

describe('Handle Recovering User Infos', () => {
  test('Should return 400 if no token is provided', async () => {
    const token = '';
    const tokenController = makeSut();

    const response = await tokenController.handleRecoverUserInfos(token);

    expect(response).toEqual(badRequest('Não foi encontrado nenhum Token.'));
  });

  test('Should return 400 if token is expired', async () => {
    const token = 'token';
    const webTokenStub = makeWebToken();

    jest.spyOn(webTokenStub, 'verify').mockImplementationOnce(() => {
      throw new TokenExpiredError('jwt expired', new Date());
    })

    const emailValidatorStub = makeEmailValidator();
    const encrypterStub = makeEncrypter()

    const tokenController = new TokenController(emailValidatorStub, UserRepositoryMocked, webTokenStub, encrypterStub);

    const response = await tokenController.handleRecoverUserInfos(token);

    expect(response).toEqual(badRequest('Token expirado.'));
  });

  test('Should return 404 if token id no return a user', async () => {
    const token = 'token';
    const webTokenStub = makeWebToken();
    const emailValidatorStub = makeEmailValidator();
    const encrypterStub = makeEncrypter()
    jest.spyOn(UserRepositoryMocked, 'findById').mockResolvedValueOnce(await Promise.resolve(undefined));
    const tokenController = new TokenController(emailValidatorStub, UserRepositoryMocked, webTokenStub, encrypterStub);

    const response = await tokenController.handleRecoverUserInfos(token);

    expect(response).toEqual(notFound('Usuário não existe.'));
  });

  test('Should return 200 and user infos if success recovering user infos', async () => {
    const token = 'token';

    const tokenController = makeSut();
    const response = await tokenController.handleRecoverUserInfos(token);

    expect(response).toEqual(okWithPayload(response.payload as string, {
      id: response.userInfo?.userInfo.id,
      email: response.userInfo?.userInfo.email as string,
      name: response.userInfo?.userInfo.name  as string,
    }));
  });
});
