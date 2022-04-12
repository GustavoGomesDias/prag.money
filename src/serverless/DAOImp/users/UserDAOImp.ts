import { Prisma } from '@prisma/client';
import UserModel from '../../data/models/UserModel';

import GenericDAOImp from '../../infra/DAO/GenericDAOImp';
import UserDAO from './UserDAO';
import prisma from '../../data/prisma/config';
import EncryptAdapter from '../../adapters/services/EncryptAdapter';
import GetForeignInfos, { ReturnForeignInfos } from '../../data/usecases/GetForeignInfos';
import { checkIfExists404code } from '../../api/helpers/Validations';

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

  async getAllForeignInfosByUserId(userId: number): Promise<GetForeignInfos | undefined> {
    const foreignInfos = await this.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: false,
        email: false,
        name: false,
        created_at: false,
        _count: false,
        password: false,
        updated_at: false,
        Payment: true,
        Purchase: true,
      },
    }) as ReturnForeignInfos;

    if (foreignInfos === null || foreignInfos === undefined || !foreignInfos) {
      return undefined;
    }

    const { Payment, Purchase } = foreignInfos;

    return {
      payments: Array.isArray(Payment) ? Payment : [Payment],
      purchases: Array.isArray(Purchase) ? Purchase : [Purchase],
    };
  }

  async findByEmail(info: string): Promise<UserModel> {
    const user = await this.findUnique({
      where: {
        email: info,
      },
    });

    checkIfExists404code(user, 'Usuário não existente, considere criar uma conta.');

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

  async checkIfUserExists(userId: number): Promise<void> {
    const user = await this.findUnique({
      where: {
        id: userId,
      },
    }) as unknown as Omit<UserModel, 'password'> | undefined | null;

    checkIfExists404code(user, 'Usuário não existe.');
  }
}
