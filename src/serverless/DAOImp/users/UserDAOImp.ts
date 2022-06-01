/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client';
import UserModel from '../../data/models/UserModel';

import GenericDAOImp from '../../infra/DAO/GenericDAOImp';
import UserDAO from './UserDAO';
import prisma from '../../data/prisma/config';
import EncryptAdapter from '../../adapters/services/EncryptAdapter';
import GetForeignInfos, { ReturnForeignInfos } from '../../data/usecases/GetForeignInfos';
import { checkIfExists404code } from '../../api/helpers/Validations';
import GetAcquisitions from '../../data/usecases/GetAcquisitions';
import { NotFoundError } from '../../error/HttpError';
import FinancialHelperAdapter from '../../adapters/services/FinancialHelperAdapter';

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

  private readonly financialHelper: FinancialHelperAdapter;

  constructor(encrypter: EncryptAdapter, financialHelper: FinancialHelperAdapter) {
    super(prisma.user);
    this.encrypter = encrypter;
    this.financialHelper = financialHelper;
  }

  async checkIfUserExists(userId: number): Promise<void> {
    const user = await this.findUnique({
      where: {
        id: userId,
      },
    }) as unknown as Omit<UserModel, 'password'> | undefined | null;

    checkIfExists404code(user, 'Usuário não existe.');
  }

  async getAllForeignInfosByUserId(userId: number): Promise<GetForeignInfos> {
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
        Payment: {
          select: {
            PayWith: {
              select: {
                id: true,
                payment_id: true,
                purchase_id: true,
                value: true,
                purchase: {
                  select: {
                    created_at: true,
                  },
                },
              },
            },
            default_value: true,
            reset_day: true,
            nickname: true,
            user_id: true,
            id: true,
          },
        },
        Purchase: true,
      },
    }) as ReturnForeignInfos;

    checkIfExists404code(foreignInfos, 'Não há formas de pagamento cadastradas.');
    const { Payment, Purchase } = foreignInfos;
    checkIfExists404code(Payment, 'Não há formas de pagamento cadastradas.');

    if (Array.isArray(Payment)) {
      for (const payment of Payment) {
        this.financialHelper.updateCurrentValue(payment);
      }
    } else {
      this.financialHelper.updateCurrentValue(Payment);
    }

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
}
