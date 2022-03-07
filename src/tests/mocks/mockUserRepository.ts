/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import UserRepository from '../../serverless/repositories/users/UserRepository';

const UserRepositoryMocked: UserRepository = jest.genMockFromModule('../../serverless/repositories/users/UserRepository');

UserRepositoryMocked.addUser = jest.fn(async (req) => {
  const result = await Promise.resolve({
    email: req.email,
    name: req.name,
  });
  return result;
});

UserRepositoryMocked.findById = jest.fn(async (data) => {
  const result = await Promise.resolve({
    id: 1,
    email: 'email@email.com',
    name: 'name',
  });
  return result;
});

UserRepositoryMocked.findByEmail = jest.fn(async (info: string) => {
  const result = await Promise.resolve({
    id: 1,
    email: 'email@email.com',
    name: 'name',
    password: 'hash',
  });

  return result;
});

export default UserRepositoryMocked;
