import { PrismaClient } from '@prisma/client';
import UserModel from '../../../serverless/data/models/UserModel';
import UserDAOImp from '../../../serverless/DAOImp/users/UserDAOImp';
import mockUserDAOImp from '../../mocks/mockUserDAOImp';

jest.mock('../../mocks/mockUserDAOImp');

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

const makeSut = (): UserDAOImp => mockUserDAOImp;

describe('User Repository test', () => {
  test('Should call addUer with correct values', async () => {
    const req: UserModel = {
      email: 'email@email.com',
      name: 'name',
      password: 'password',
    };
    const dao = makeSut();
    const spy = jest.spyOn(dao, 'addUser');
    await dao.addUser(req);

    expect(spy).toHaveBeenCalledWith(req);
  });

  test('Should return created account email and name infos', async () => {
    const req: UserModel = {
      email: 'email@email.com',
      name: 'name',
      password: 'password',
    };
    const dao = makeSut();
    const result = await dao.addUser(req);

    expect(result).toEqual({
      email: 'email@email.com',
      name: 'name',
    });
  });

  test('Should call findByEmail with correct email', async () => {
    const req = 'email@email.com';
    const dao = makeSut();
    const spy = jest.spyOn(dao, 'findByEmail');
    await dao.findByEmail(req);

    expect(spy).toHaveBeenCalledWith(req);
  });

  test('Should returns account user infos', async () => {
    const req = 'email@email.com';
    const dao = makeSut();
    const result = await dao.findByEmail(req);

    expect(result).toEqual({
      id: 1,
      email: 'email@email.com',
      name: 'name',
      password: 'hash',
    });
  });
});
