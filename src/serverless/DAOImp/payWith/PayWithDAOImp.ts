import { Prisma } from '@prisma/client';
import PayWithModel from '../../data/models/PayWithModel';
import prisma from '../../data/prisma/config';
import GenericDAOImp from '../../infra/DAO/GenericDAOImp';

export default class PaymentRepository extends GenericDAOImp<
  PayWithModel,
  Prisma.PayWithFindUniqueArgs,
  Prisma.PayWithUpdateArgs,
  Prisma.PayWithDeleteArgs
> {
  constructor() {
    super(prisma.payWith);
  }
}
