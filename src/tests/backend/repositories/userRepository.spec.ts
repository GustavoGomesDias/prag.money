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

// const makeAddUser = (encrypter: EncryptAdapter): UserRepository => {
//   const respository = new UserRepository(encrypter);
//   jest.spyOn(respository, 'addUser').mockImplementation(async (req) => {
//     return await Promise.resolve({
//       email: req.email,
//       name: req.name,
//     });
//   });

//   return respository;
// }

const makeSut = (): UserRepository => {
  const encrypter = makeEncrypter();

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
});