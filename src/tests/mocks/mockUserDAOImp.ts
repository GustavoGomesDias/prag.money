/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import UserDAOImp from '../../serverless/DAOImp/users/UserDAOImp';

const mockUserDAOImp: UserDAOImp = jest.genMockFromModule('../../serverless/DAOImp/users/UserDAOImp');

mockUserDAOImp.addUser = jest.fn(async (req) => {
  const result = await Promise.resolve({
    email: req.email,
    name: req.name,
  });
  return result;
});

mockUserDAOImp.findUnique = jest.fn(async (data) => {
  const result = await Promise.resolve({
    id: 1,
    email: 'email@email.com',
    name: 'name',
  });
  return result;
});

mockUserDAOImp.findByEmail = jest.fn(async (info: string) => {
  const result = await Promise.resolve({
    id: 1,
    email: 'email@email.com',
    name: 'name',
    password: 'hash',
  });

  return result;
});

mockUserDAOImp.checkIfUserExists = jest.fn(async (infos) => {
  const result = await Promise.resolve(true);

  return result;
});

export default mockUserDAOImp;
