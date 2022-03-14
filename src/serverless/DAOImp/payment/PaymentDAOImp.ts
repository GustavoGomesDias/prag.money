import { Prisma } from '@prisma/client';
import PaymentModel from '../../data/models/PaymentModel';
import prisma from '../../data/prisma/config';
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

  async checkIfPaymentExists(paymentId: number): Promise<boolean> {
    const payment = await this.findById({
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
