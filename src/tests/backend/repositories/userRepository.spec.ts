import { PrismaClient } from '@prisma/client';
import UserModel from '../../../serverless/data/models/UserModel';
import UserRepository from '../../../serverless/repositories/UserRepository';;

afterAll(async () => {
  const prisma = new PrismaClient();
  await prisma.user.delete({
    where: {
      email: 'email@email.com', 
    },
  });
});

describe('User Repository test', () => {
  test('Should call addUer with correct values', async () => {
    const req: UserModel = {
      email: 'email@email.com',
      name: 'name',
      password: 'password',
    };
    const repository = new UserRepository();
    const spy = jest.spyOn(repository, 'addUser');
    await repository.addUser(req);

    expect(spy).toHaveBeenCalledWith(req);
  });
});