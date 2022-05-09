/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { EmailValidatorAdapter } from '../../../../serverless/adapters/services/EmailValidatorAdapter';
import EncryptAdapter from '../../../../serverless/adapters/services/EncryptAdapter';
import UserController from '../../../../serverless/api/controllers/User';
import { badRequest } from '../../../../serverless/api/helpers/http';
import UserDAOImp from '../../../../serverless/DAOImp/users/UserDAOImp';
import { BadRequestError } from '../../../../serverless/error/HttpError';
import mockUserDAOImp from '../../../mocks/mockUserDAOImp';

jest.mock('../../../mocks/mockUserDAOImp');

afterEach(() => jest.clearAllMocks());

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
  return new UserController(emailValidatorStub, mockUserDAOImp);
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
});
