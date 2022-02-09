import { PrismaClient } from '@prisma/client';
import EncryptAdapter from '../../../serverless/adapters/services/EncryptAdapter';
import UserModel from '../../../serverless/data/models/UserModel';
import UserRepository from '../../../serverless/repositories/UserRepository';;

afterEach(async () => {
  const prisma = new PrismaClient();
  await prisma.user.delete({
    where: {
      email: 'email@email.com', 
    },
  });
});

const makeEncrypter = (): EncryptAdapter => {
  class EncrypterStub implements EncryptAdapter {
    async encrypt(password: string): Promise<string> {
      return new Promise((resolve) => resolve('hash'));
    }
  }

  return new EncrypterStub();
}

const makeSut = (): UserRepository => {
  const encrypter = makeEncrypter();

  return new UserRepository(encrypter);
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