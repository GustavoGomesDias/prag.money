import { Prisma } from '@prisma/client';
import UserModel from '../../data/models/UserModel';

import GenericDAOImp from '../../infra/DAO/GenericDAOImp';
import UserDAO from './UserDAO';
import prisma from '../../data/prisma/config';
import EncryptAdapter from '../../adapters/services/EncryptAdapter';
import PaymentModel from '../../data/models/PaymentModel';
// import PaymentModel from '../../data/models/PaymentModel';

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

  async getAllPaymentByUserId(userId: number): Promise<PaymentModel[] | undefined> {
    const allPayments = await this.findById({
      where: {
        id: userId,
      },
      select: {
        id: false,
        email: false,
        name: false,
        Purchase: false,
        created_at: false,
        _count: false,
        password: false,
        updated_at: false,
        Payment: true,
      },
    });

    if (allPayments === null || allPayments === undefined || !allPayments) {
      return undefined;
    }
    return allPayments as unknown as PaymentModel[];
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

  async checkIfUserExists(userId: number): Promise<boolean> {
    const user = await this.findById({
      where: {
        id: userId,
      },
    }) as unknown as Omit<UserModel, 'password'> | undefined | null;

    if (!user || user === undefined || user === null) {
      return false;
    }

    return true;
  }
}
