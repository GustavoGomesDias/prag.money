import { Prisma } from '@prisma/client';
import PaymentModel from '../../data/models/PaymentModel';
import prisma from '../../data/prisma/config';
import GetAcquisitions, { ReturnsAcquisitions } from '../../data/usecases/GetAcquisitions';
import GenericDAOImp from '../../infra/DAO/GenericDAOImp';
import PaymentDAO from './PaymentDAO';

export default class PaymentDAOImp extends GenericDAOImp<
  PaymentModel,
  Prisma.PaymentFindUniqueArgs,
  Prisma.PaymentUpdateArgs,
  Prisma.PaymentDeleteArgs
> implements PaymentDAO<
PaymentModel,
Prisma.PaymentFindUniqueArgs,
Prisma.PaymentUpdateArgs,
Prisma.PaymentDeleteArgs
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
        PayWith: true,
        default_value: true,
        nickname: true,
        reset_day: true,
        user_id: true,
      },
    }) as GetAcquisitions;

    const { PayWith, ...paymentInfos } = getAcquisitionsInfos;
    return {
      acquisitions: PayWith,
      ...paymentInfos,
    };
  }

  async checkIfPaymentExists(paymentId: number): Promise<boolean> {
    const payment = await this.findUnique({
      where: {
        id: paymentId,
      },
    }) as unknown as PaymentModel | undefined | null;

    if (!payment || payment === undefined || payment === null) {
      return false;
    }

    return true;
  }
}
