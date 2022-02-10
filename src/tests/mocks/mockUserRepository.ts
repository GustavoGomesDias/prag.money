import UserRepository from '../../serverless/repositories/UserRepository';

const UserRepositoryMocked: UserRepository = jest.genMockFromModule('../../serverless/repositories/UserRepository');

UserRepositoryMocked.addUser = jest.fn(async (req) => {
  return await Promise.resolve({
    email: req.email,
    name: req.name,
  })
});

export default UserRepositoryMocked;