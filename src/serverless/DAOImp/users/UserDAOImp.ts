import { Prisma } from '@prisma/client';
import UserModel from '../../data/models/UserModel';

import GenericDAOImp from '../../infra/DAO/GenericDAOImp';
import UserDAO from './IUserDAO';
import prisma from '../../data/prisma/config';
import EncryptAdapter from '../../adapters/services/EncryptAdapter';

export default class UserDAOImp extends GenericDAOImp<
  UserModel,
  Prisma.UserFindUniqueArgs,
  Prisma.UserUpdateInput,
  Prisma.UserDeleteArgs
> implements UserDAO<
  UserModel,
  Prisma.UserFindUniqueArgs,
  Prisma.UserUpdateInput,
  Prisma.UserDeleteArgs
> {
  private readonly encrypter: EncryptAdapter;

  constructor(encrypter: EncryptAdapter) {
    super(prisma.user);
    this.encrypter = encrypter;
  }

  async findByEmail(info: string): Promise<UserModel | undefined> {
    const user = await prisma.user.findUnique({
      where: {
        email: info,
      },
    });

    if (!user || user === null) {
      return undefined;
    }

    const {
      id, email, name, password,
    } = user as UserModel;

    return {
      id,
      email,
      name,
      password,
    };
  }

  async addUser(req: UserModel): Promise<Omit<UserModel, 'password'>> {
    const { email, name, password } = req;
    const hash = await this.encrypter.encrypt(password);
    const result = await this.add({ email, name, password: hash }) as Omit<UserModel, 'password'>;

    return {
      email: result.email,
      name: result.name,
    };
  }
}
