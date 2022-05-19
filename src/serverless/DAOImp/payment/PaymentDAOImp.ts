import { Prisma } from '@prisma/client';
import { checkIfExists404code } from '../../api/helpers/Validations';
import PaymentModel from '../../data/models/PaymentModel';
import prisma from '../../data/prisma/config';
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
        PayWith: true,
        default_value: true,
        nickname: true,
        reset_day: true,
        user_id: true,
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
      take: 6,
      skip: (4 * page),
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
      acquisitions: Array.isArray(PayWith) ? PayWith : [PayWith],
      ...paymentInfos,
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
}
