/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client';
import UserModel from '../../../serverless/data/models/UserModel';
import UserDAOImp from '../../../serverless/DAOImp/users/UserDAOImp';
import EncryptAdapter from '../../../serverless/adapters/services/EncryptAdapter';
import prismaConfig from '../../../serverless/data/prisma/config';
import GenericDAOImp from '../../../serverless/infra/DAO/GenericDAOImp';
import { NotFoundError } from '../../../serverless/error/HttpError';
import { mockPayment, mockPurchase } from '../../mocks/mockForeignInfos';

jest.mock('../../mocks/mockUserDAOImp');

afterAll(() => jest.resetAllMocks());

const makeEncrypter = (): EncryptAdapter => {
  class EncryptStub implements EncryptAdapter {
    async encrypt(password: string): Promise<string> {
      const result = await Promise.resolve('hash');
      return result;
    }

    async compare(password: string, passHashed: string): Promise<boolean> {
      const result = await Promise.resolve(true);
      return result;
    }
  }

  return new EncryptStub();
};
const makeSut = (): UserDAOImp => {
  const encrypter = makeEncrypter();

  return new UserDAOImp(encrypter);
};

describe('User DAO Implementation test', () => {
  const purchaseDate = new Date();
  test('Should call constructor with prisma.user', () => {
    const encrypter = makeEncrypter();
    const instance = new UserDAOImp(encrypter);

    // eslint-disable-next-line dot-notation
    expect(instance['encrypter']).toEqual(encrypter);
    // eslint-disable-next-line dot-notation
    expect(instance['entity']).toEqual(prismaConfig.user);
  });

  test('Should call addUer with correct values', async () => {
    const info: UserModel = {
      email: 'email@email.com',
      name: 'name',
      password: 'password',
    };

    jest.spyOn(GenericDAOImp.prototype, 'add').mockImplementationOnce(async (req) => {
      const result = await Promise.resolve({
        email: req.email,
        name: req.name,
      });
      return result;
    });

    const userDAOStub = makeSut();
    const spy = jest.spyOn(userDAOStub, 'addUser');
    await userDAOStub.addUser(info);

    expect(spy).toHaveBeenCalledWith(info);
  });

  test('Should addUer returns correct values', async () => {
    const info: UserModel = {
      email: 'email@email.com',
      name: 'name',
      password: 'password',
    };

    jest.spyOn(GenericDAOImp.prototype, 'add').mockImplementationOnce(async (req) => {
      const result = await Promise.resolve({
        email: req.email,
        name: req.name,
      });
      return result;
    });

    const userDAOStub = makeSut();
    const result = await userDAOStub.addUser(info);

    expect(result).toEqual({
      email: 'email@email.com',
      name: 'name',
    });
  });

  test('Should call findByEmail with correct email', async () => {
    const req = 'email@email.com';
    const userDAOImpStub = makeSut();
    const spy = jest.spyOn(userDAOImpStub, 'findByEmail').mockImplementationOnce(jest.fn());
    await userDAOImpStub.findByEmail(req);

    expect(spy).toHaveBeenCalledWith(req);
  });

  test('Should findByEmail returns account user infos', async () => {
    const req = 'email@email.com';

    jest.spyOn(GenericDAOImp.prototype, 'findUnique').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve({
        id: 1,
        email: 'teste@teste.com',
        name: 'name',
        password: 'hash',
      });
      return result;
    });

    const userDAOImpStub = makeSut();
    const result = await userDAOImpStub.findByEmail(req);

    expect(result).toEqual({
      id: 1,
      email: 'teste@teste.com',
      name: 'name',
      password: 'hash',
    });
  });

  test('Should findByEmail returns NotFoundError if user not exists', async () => {
    const req = 'email@email.com';
    const userDAOImpStub = makeSut();
    await expect(userDAOImpStub.findByEmail(req)).rejects.toThrow(new NotFoundError('Usuário não existente, considere criar uma conta.'));
  });

  test('Should call checkIfUserExistis if correct user', async () => {
    const req = 1;
    const userDAOImpStub = makeSut();

    const spy = jest.spyOn(UserDAOImp.prototype, 'checkIfUserExists').mockImplementationOnce(jest.fn());
    await userDAOImpStub.checkIfUserExists(req);

    expect(spy).toHaveBeenCalledWith(req);
  });

  test('Should ensure that checkIfUserExistis throws an error if the user does not exist', async () => {
    const req = 1;
    const userDAOImpStub = makeSut();

    jest.spyOn(GenericDAOImp.prototype, 'findUnique').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve(undefined);

      return result;
    });
    await expect(userDAOImpStub.checkIfUserExists(req)).rejects.toThrow(new NotFoundError('Usuário não existe.'));
  });

  // test('Should ensure that checkIfUserExistis throws an NotFoundError if the user does not exist', async () => {
  //   jest.spyOn(UserDAOImp.prototype, 'findUnique').mockImplementationOnce(async (info) => {
  //     const result = await Promise.resolve(undefined);
  //     return result;
  //   });
  //   await expect(UserDAOImp.prototype.checkIfUserExists(-1)).rejects.toThrowError(NotFoundError);
  // });

  test('Should return Purchase and Payment array if findUnique returns array', async () => {
    jest.spyOn(UserDAOImp.prototype, 'findUnique').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve({
        Payment: [mockPayment],
        Purchase: [mockPurchase],
      });

      return result;
    });

    const userDAOImpStub = makeSut();

    const result = await userDAOImpStub.getAllForeignInfosByUserId(1);

    expect(Array.isArray(result?.payments)).toBeTruthy();
    expect(Array.isArray(result?.purchases)).toBeTruthy();
  });

  test('Should return Purchase and Payment array if findUnique no returns array', async () => {
    jest.spyOn(UserDAOImp.prototype, 'findUnique').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve({
        Payment: mockPayment,
        Purchase: mockPurchase,
      });

      return result;
    });

    const userDAOImpStub = makeSut();

    const result = await userDAOImpStub.getAllForeignInfosByUserId(1);

    expect(Array.isArray(result?.payments)).toBeTruthy();
    expect(Array.isArray(result?.purchases)).toBeTruthy();
  });

  test('Should payment value is equals default value for older purchases (month)', async () => {
    const { PayWith, default_value, ...anotherRest } = mockPayment;
    const { purchase, ...rest } = PayWith;

    jest.spyOn(UserDAOImp.prototype, 'findUnique').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve({
        Payment: {
          ...anotherRest,
          default_value: 800,
          PayWith: {
            ...rest,
            purchase: {
              create_at: new Date('2022-04-20T18:33:18.189Z'),
            },
          },
        },
        Purchase: mockPurchase,
      });

      return result;
    });

    const userDAOImpStub = makeSut();

    const result = await userDAOImpStub.getAllForeignInfosByUserId(1);

    expect(result?.payments[0].default_value).toEqual(800);
  });

  test('Should payment value is equals default value for older purchases (day)', async () => {
    const { PayWith, default_value, ...anotherRest } = mockPayment;
    const { purchase, ...rest } = PayWith;

    jest.spyOn(UserDAOImp.prototype, 'findUnique').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve({
        Payment: {
          ...anotherRest,
          default_value: 800,
          PayWith: {
            ...rest,
            purchase: {
              create_at: new Date('2022-05-18T18:33:18.189Z'),
            },
          },
        },
        Purchase: mockPurchase,
      });

      return result;
    });

    const userDAOImpStub = makeSut();

    const result = await userDAOImpStub.getAllForeignInfosByUserId(1);

    expect(result?.payments[0].default_value).toEqual(800);
  });
});
