/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client';
import UserModel from '../../../serverless/data/models/UserModel';
import UserDAOImp from '../../../serverless/DAOImp/users/UserDAOImp';
import mockUserDAOImp from '../../mocks/mockUserDAOImp';
import EncryptAdapter from '../../../serverless/adapters/services/EncryptAdapter';
import prismaConfig from '../../../serverless/data/prisma/config';
import GenericDAOImp from '../../../serverless/infra/DAO/GenericDAOImp';

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
    const spy = jest.spyOn(mockUserDAOImp, 'findByEmail');
    await mockUserDAOImp.findByEmail(req);

    expect(spy).toHaveBeenCalledWith(req);
  });

  test('Should returns account user infos', async () => {
    const req = 'email@email.com';
    const result = await mockUserDAOImp.findByEmail(req);

    expect(result).toEqual({
      id: 1,
      email: 'email@email.com',
      name: 'name',
      password: 'hash',
    });
  });
});
