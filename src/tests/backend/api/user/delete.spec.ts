/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { EmailValidatorAdapter } from '../../../../serverless/adapters/services/EmailValidatorAdapter';
import EncryptAdapter from '../../../../serverless/adapters/services/EncryptAdapter';
import UserController from '../../../../serverless/api/controllers/User';
import { badRequest, ok } from '../../../../serverless/api/helpers/http';
import UserDAOImp from '../../../../serverless/DAOImp/users/UserDAOImp';
import { BadRequestError } from '../../../../serverless/error/HttpError';

jest.mock('../../../mocks/mockUserDAOImp');

// afterEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const makeEmailValidator = (): EmailValidatorAdapter => {
  class EmailValidatorStub implements EmailValidatorAdapter {
    // eslint-disable-next-line no-unused-vars
    isEmail(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeEncrypter = (): EncryptAdapter => {
  class Encrypter implements EncryptAdapter {
    encrypt(password: string): Promise<string> {
      console.log(password);
      throw new Error('Method not implemented.');
    }

    compare(password: string, passHashed: string): Promise<boolean> {
      console.log(password, passHashed);
      throw new Error('Method not implemented.');
    }
  }
  return new Encrypter();
};

const makeSut = (): UserController => {
  const emailValidatorStub = makeEmailValidator();
  const encrypt = makeEncrypter();
  const userDAOImp = new UserDAOImp(encrypt);
  return new UserController(emailValidatorStub, userDAOImp);
};

describe('Handle Delete User Function', () => {
  test('Should return 400 if invalid user id is provided', async () => {
    const userControllerStub = makeSut();
    // eslint-disable-next-line prefer-destructuring
    const entity = new UserDAOImp(makeEncrypter())['entity'];
    jest.spyOn(entity, 'delete').mockImplementationOnce(jest.fn());

    const result = await userControllerStub.handleDelete(-1);

    expect(result).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 200 if user is deleted', async () => {
    // eslint-disable-next-line prefer-destructuring
    const entity = new UserDAOImp(makeEncrypter())['entity'];
    jest.spyOn(entity, 'delete').mockImplementationOnce(jest.fn());

    const userControllerStub = makeSut();
    const result = await userControllerStub.handleDelete(1);

    expect(result).toEqual(ok('Deletado com sucesso!'));
  });
});
