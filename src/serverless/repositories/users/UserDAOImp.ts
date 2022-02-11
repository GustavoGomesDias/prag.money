import { PrismaClient } from '@prisma/client';
import UserModel from '../../data/models/UserModel';
import LoginProps from '../../data/usecases/Login';
import GenericDAOImp from '../../infra/DAO/GenericDAOImp';
import UserDAO from './UserDAO';


export default class UserDAOImp<C, R, U, D> extends GenericDAOImp<C, R, U, D> implements UserDAO<C, R, U, D>{

  async findByEmail(info: string): Promise<Omit<UserModel, 'password'> | undefined> {
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: {
        email: info
      },
    });

    if (!user || user === null) {
      return undefined
    }

    const { email, name } = user as UserModel;

    return {
      email,
      name,
    }
  }

}