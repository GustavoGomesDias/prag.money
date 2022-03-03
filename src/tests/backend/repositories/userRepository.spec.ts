import { PrismaClient } from '@prisma/client';
import EncryptAdapter from '../../../serverless/adapters/services/EncryptAdapter';
import UserModel from '../../../serverless/data/models/UserModel';
import UserRepository from '../../../serverless/repositories/users/UserRepository';
import UserRepositoryMocked from '../../mocks/mockUserRepository';

jest.mock('../../mocks/mockUserRepository');

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

const makeEncrypter = (): EncryptAdapter => {
  class EncrypterStub implements EncryptAdapter {
    compare(password: string, passHashed: string): Promise<boolean> {
      throw new Error('Method not implemented.');
    }
    async encrypt(password: string): Promise<string> {
      return new Promise((resolve) => resolve('hash'));
    }
  }

  return new EncrypterStub();
}

const makeSut = (): UserRepository => {
  return UserRepositoryMocked;
}

describe('User Repository test', () => {

  test('Should call addUer with correct values', async () => {
    const req: UserModel = {
      email: 'email@email.com',
      name: 'name',
      password: 'password',
    };
    const repository = makeSut()
    const spy = jest.spyOn(repository, 'addUser');
    await repository.addUser(req);

    expect(spy).toHaveBeenCalledWith(req);
  });

  test('Should return created account email and name infos', async () => {
    const req: UserModel = {
      email: 'email@email.com',
      name: 'name',
      password: 'password',
    };
    const repository = makeSut()
    const result = await repository.addUser(req);

    expect(result).toEqual({
      email: 'email@email.com',
      name: 'name',
    });
  });

  test('Should call findByEmail with correct email', async () => {
    const req: string = 'email@email.com'
    const repository = makeSut()
    const spy = jest.spyOn(repository, 'findByEmail');
    await repository.findByEmail(req);

    expect(spy).toHaveBeenCalledWith(req);
  });

  test('Should returns account user infos', async () => {
    const req: string = 'email@email.com'
    const repository = makeSut();
    const result = await repository.findByEmail(req);

    expect(result).toEqual({
      id: 1,
      email: 'email@email.com',
      name: 'name',
      password: 'hash',
    });
  });
});
