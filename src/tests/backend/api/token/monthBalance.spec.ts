/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { EmailValidatorAdapter } from '../../../../serverless/adapters/services/EmailValidatorAdapter';
import EncryptAdapter from '../../../../serverless/adapters/services/EncryptAdapter';
import WebTokenAdapter from '../../../../serverless/adapters/services/WebTokenAdapter';
import TokenController from '../../../../serverless/api/controllers/TokenController';
import PaymentDAOImp from '../../../../serverless/DAOImp/payment/PaymentDAOImp';
import UserDAOImp from '../../../../serverless/DAOImp/users/UserDAOImp';
import UserModel from '../../../../serverless/data/models/UserModel';
import GetAcquisitions from '../../../../serverless/data/usecases/GetAcquisitions';

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
};

const makeEncrypter = (): EncryptAdapter => {
  class EncryptStub implements EncryptAdapter {
    encrypt(password: string): Promise<string> {
      throw new Error('Method not implemented.');
    }

    async compare(password: string, passHashed: string): Promise<boolean> {
      const result = await Promise.resolve(true);
      return result;
    }
  }

  return new EncryptStub();
};

const makeSut = (): TokenController => {
  const emailValidatorStub = makeEmailValidator();
  const webTokenStub = makeWebToken();
  const encrypterStub = makeEncrypter();
  const paymentDAOStub = new PaymentDAOImp();
  const userDAOStub = new UserDAOImp(encrypterStub);
  return new TokenController(emailValidatorStub, userDAOStub, webTokenStub, encrypterStub, paymentDAOStub);
};

describe('Resolve Month Balance Tests', () => {
  const purchaseDate = new Date('2022-05-20T18:33:18.189Z');
  const payments: GetAcquisitions = {
    PayWith: {
      payment_id: 1,
      purchase: {
        created_at: purchaseDate.toString(),
      },
      purchase_id: 1,
      value: 1,
      id: 1,
    },
    current_month: 1,
    default_value: 1,
    nickname: 'nickname',
    reset_day: 1,
    user_id: 1,
    current_value: 1,
    id: 1,
  };
  test('Should ensure call PaymentDAOImp setMonthBalance function for three times', async () => {
    const spy = jest.spyOn(PaymentDAOImp.prototype, 'setMonthBalance').mockImplementation(jest.fn());

    const tokenControllerStub = makeSut();

    await tokenControllerStub.resolveMonthBalance([payments, payments, payments]);

    expect(spy).toHaveBeenCalledTimes(3);
  });
});
