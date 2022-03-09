import { Prisma } from '@prisma/client';
import PaymentModel from '../../data/models/PaymentModel';
import prisma from '../../data/prisma/config';
import GenericDAOImp from '../../infra/DAO/GenericDAOImp';

export default class PaymentRepository extends GenericDAOImp<
  PaymentModel,
  Prisma.PaymentFindUniqueArgs,
  Prisma.PaymentUpdateArgs,
  Prisma.PaymentDeleteArgs
> {
  constructor() {
    super(prisma.payment);
  }
}
