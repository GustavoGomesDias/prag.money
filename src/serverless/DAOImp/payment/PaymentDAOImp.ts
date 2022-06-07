/* eslint-disable camelcase */
import { Prisma } from '@prisma/client';
import { GetDate } from '../../adapters/services/FinancialHelperAdapter';
import { checkIfExists404code } from '../../api/helpers/Validations';
import PaymentModel from '../../data/models/PaymentModel';
import prisma from '../../data/prisma/config';
import AddAdditionalValue from '../../data/usecases/AddAdditionalValue';
import GetAcquisitions, { ReturnsAcquisitions } from '../../data/usecases/GetAcquisitions';
import ExtendGenericDAOImp from '../../infra/DAO/ExtendGenericDAOImp';
import PaymentDAO from './PaymentDAO';

export default class PaymentDAOImp extends ExtendGenericDAOImp<
  PaymentModel,
  Prisma.PaymentFindUniqueArgs,
  Prisma.PaymentUpdateArgs,
  Prisma.PaymentDeleteArgs,
  Prisma.PaymentFindManyArgs
> implements PaymentDAO<
PaymentModel,
Prisma.PaymentFindUniqueArgs,
Prisma.PaymentUpdateArgs,
Prisma.PaymentDeleteArgs,
Prisma.PaymentFindManyArgs
> {
  constructor() {
    super(prisma.payment);
  }

  async findByPaymentId(paymentId: number): Promise<ReturnsAcquisitions> {
    const getAcquisitionsInfos = await this.findUnique({
      where: {
        id: Number(paymentId),
      },
      select: {
        PayWith: {
          orderBy: {
            purchase: {
              created_at: 'desc',
            },
          },
        },
        default_value: true,
        nickname: true,
        reset_day: true,
        user_id: true,
        current_value: true,
      },
    }) as GetAcquisitions;

    const { PayWith, ...paymentInfos } = getAcquisitionsInfos;

    return {
      acquisitions: Array.isArray(PayWith) ? PayWith.slice(0, 6) : [PayWith],
      ...paymentInfos,
    };
  }

  async findByPaymentIdWithPagination(paymentId: number, page: number): Promise<ReturnsAcquisitions> {
    const getAcquisitionsInfos = await this.findMany({
      where: {
        id: Number(paymentId),
      },
      select: {
        PayWith: {
          take: 6,
          skip: (6 * page),
          orderBy: {
            purchase: {
              created_at: 'desc',
            },
          },
        },
        default_value: true,
        nickname: true,
        reset_day: true,
        user_id: true,
        current_value: true,
      },
    }) as GetAcquisitions[];

    checkIfExists404code(getAcquisitionsInfos[0], 'Não há mais gastos/compras cadastrados nessa conta.');

    const {
      PayWith, ...rest
    } = getAcquisitionsInfos[0];

    return {
      acquisitions: Array.isArray(PayWith) ? PayWith : [PayWith],
      ...rest,
    };
  }

  async checkIfPaymentExists(paymentId: number): Promise<void> {
    const payment = await this.findUnique({
      where: {
        id: paymentId,
      },
    }) as unknown as PaymentModel | undefined | null;
    checkIfExists404code(payment, 'Forma de pagamento não cadastrada.');
  }

  async updateAccountValueWithBalance(payment: GetAcquisitions) {
    await this.update({
      where: {
        id: payment.id,
      },

      data: {
        current_month: new Date(Date.now()).getMonth() + 1,
        current_value: {
          increment: payment.default_value,
        },
      },
    });
  }

  getDayAndMonth(date: Date): GetDate {
    const createdAt = new Date(date);
    const day = createdAt.getDate();
    const month = createdAt.getMonth() + 1;

    return {
      day, month,
    };
  }

  async hasMonthBalance(acquisition: GetAcquisitions): Promise<void> {
    const currentDate = new Date(Date.now());
    const { day, month } = this.getDayAndMonth(currentDate);
    const { reset_day, current_month } = acquisition;

    if (day >= reset_day && month > current_month) {
      await this.updateAccountValueWithBalance(acquisition);
    }
  }

  async resolveHasMonthBalance(payments: GetAcquisitions[]) {
    const results = [];
    for (const payment of payments) {
      results.push(this.hasMonthBalance(payment));
    }
    await Promise.all(results);
  }

  async setMonthBalance(payments: GetAcquisitions | GetAcquisitions[]) {
    if (Array.isArray(payments)) {
      await this.resolveHasMonthBalance(payments);
    } else {
      await this.hasMonthBalance(payments);
    }
  }

  async addAdditionValue(infos: Omit<AddAdditionalValue, 'userId'>) {
    await this.update({
      where: {
        id: infos.paymentId,
      },
      data: {
        current_value: {
          increment: infos.additionalValue,
        },
      },
    });
  }
}
