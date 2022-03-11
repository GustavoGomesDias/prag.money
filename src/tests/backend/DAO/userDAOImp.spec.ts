/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client';
import UserModel from '../../../serverless/data/models/UserModel';
import UserDAOImp from '../../../serverless/DAOImp/users/UserDAOImp';
import mockUserDAOImp from '../../mocks/mockUserDAOImp';
import EncryptAdapter from '../../../serverless/adapters/services/EncryptAdapter';

jest.mock('../../mocks/mockUserDAOImp');

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

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

const makeSut = (): UserDAOImp => mockUserDAOImp;

describe('User Repository test', () => {
  test('Should call constructor with prisma.user', () => {
    const encrypter = makeEncrypter();
    const instance = new UserDAOImp(encrypter);

    // eslint-disable-next-line dot-notation
    expect(instance['encrypter']).toEqual(encrypter);
  });

  test('Should call addUer with correct values', async () => {
    const req: UserModel = {
      email: 'email@email.com',
      name: 'name',
      password: 'password',
    };

    const spy = jest.spyOn(mockUserDAOImp, 'addUser');
    await mockUserDAOImp.addUser(req);

    expect(spy).toHaveBeenCalledWith(req);
  });

  test('Should return created account email and name infos', async () => {
    const req: UserModel = {
      email: 'email@email.com',
      name: 'name',
      password: 'password',
    };

    const result = await mockUserDAOImp.addUser(req);

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
