/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client';
import UserModel from '../../../serverless/data/models/UserModel';
import UserDAOImp from '../../../serverless/DAOImp/users/UserDAOImp';
import EncryptAdapter from '../../../serverless/adapters/services/EncryptAdapter';
import prismaConfig from '../../../serverless/data/prisma/config';
import GenericDAOImp from '../../../serverless/infra/DAO/GenericDAOImp';
import { NotFoundError } from '../../../serverless/error/HttpError';

jest.mock('../../mocks/mockUserDAOImp');

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

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
    try {
      const req = 'email@email.com';
      const userDAOImpStub = makeSut();
      const result = await userDAOImpStub.findByEmail(req);
    } catch (err) {
      expect((err as Error).message).toBe('Usuário não existente, considere criar uma conta.');
    }
  });

  test('Should call checkIfUserExistis if correct user', async () => {
    const req = 1;
    const userDAOImpStub = makeSut();

    const spy = jest.spyOn(UserDAOImp.prototype, 'checkIfUserExists').mockImplementationOnce(jest.fn());
    await userDAOImpStub.checkIfUserExists(req);

    expect(spy).toHaveBeenCalledWith(req);
  });

  test('Should ensure that checkIfUserExistis throws an error if the user does not exist', async () => {
    try {
      const req = 1;
      const userDAOImpStub = makeSut();

      jest.spyOn(GenericDAOImp.prototype, 'findUnique').mockImplementationOnce(async (infos) => {
        const result = await Promise.resolve(undefined);

        return result;
      });
      await userDAOImpStub.checkIfUserExists(req);
    } catch (err) {
      expect((err as Error).message).toBe('Usuário não existe.');
    }
  });

  test('Should ensure that checkIfUserExistis throws an NotFoundError if the user does not exist', async () => {
    jest.spyOn(UserDAOImp.prototype, 'findUnique').mockImplementationOnce(async (info) => {
      const result = await Promise.resolve(undefined);
      return result;
    });
    expect(UserDAOImp.prototype.checkIfUserExists(-1)).rejects.toThrowError(NotFoundError);
  });

  test('Should getAllPaymentsByUserId returns undefined if user not exists', async () => {
    const userDAOImpStub = makeSut();
    const result = await userDAOImpStub.getAllForeignInfosByUserId(-1);

    expect(result).toEqual(undefined);
  });

  test('Should getAllPaymentsByUserId returns foreign user infos', async () => {
    const req = 1;

    jest.spyOn(UserDAOImp.prototype, 'getAllForeignInfosByUserId').mockImplementationOnce(async (userId: number) => {
      const result = await Promise.resolve({
        payments: [{
          nickname: 'nickname',
          default_value: 800,
          reset_day: 1,
          user_id: 1,
        }],
        purchases: [{
          id: 1,
          value: 800,
          description: 'description',
          purchase_date: purchaseDate,
          user_id: 1,
        }],
      });
      return result;
    });

    const userDAOImpStub = makeSut();
    const result = await userDAOImpStub.getAllForeignInfosByUserId(req);

    expect(result).toEqual({
      payments: [{
        nickname: 'nickname',
        default_value: 800,
        reset_day: 1,
        user_id: 1,
      }],
      purchases: [{
        id: 1,
        value: 800,
        description: 'description',
        purchase_date: purchaseDate,
        user_id: 1,
      }],
    });
  });

  test('Should return Purchase and Payment array if findUnique returns array', async () => {
    jest.spyOn(UserDAOImp.prototype, 'findUnique').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve({
        Payment: [{
          nickname: 'nickname',
          default_value: 800,
          reset_day: 1,
          user_id: 1,
        }],
        Purchase: [{
          id: 1,
          value: 800,
          description: 'description',
          purchase_date: purchaseDate,
          user_id: 1,
        }],
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
        Payment: {
          nickname: 'nickname',
          default_value: 800,
          reset_day: 1,
          user_id: 1,
        },
        Purchase: {
          id: 1,
          value: 800,
          description: 'description',
          purchase_date: purchaseDate,
          user_id: 1,
        },
      });

      return result;
    });

    const userDAOImpStub = makeSut();

    const result = await userDAOImpStub.getAllForeignInfosByUserId(1);

    expect(Array.isArray(result?.payments)).toBeTruthy();
    expect(Array.isArray(result?.purchases)).toBeTruthy();
  });
});
