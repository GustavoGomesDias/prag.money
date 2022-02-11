import UserRepository from '../../serverless/repositories/users/UserRepository';

const UserRepositoryMocked: UserRepository = jest.genMockFromModule('../../serverless/repositories/users/UserRepository');

UserRepositoryMocked.addUser = jest.fn(async (req) => {
  return await Promise.resolve({
    email: req.email,
    name: req.name,
  })
});

UserRepositoryMocked.findByEmail = jest.fn(async (info: string) => {
  return await Promise.resolve({
    email: 'email@email.com',
    name: 'name',
  })
});

export default UserRepositoryMocked;
