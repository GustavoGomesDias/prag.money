import { Prisma } from '@prisma/client';
import PurchaseModel from '../../data/models/Purchase';
import prisma from '../../data/prisma/config';
import GenericDAOImp from '../../infra/DAO/GenericDAOImp';

export default class PurchaseDAOImp extends GenericDAOImp<
  PurchaseModel,
  Prisma.PurchaseFindUniqueArgs,
  Prisma.PurchaseUpdateArgs,
  Prisma.PurchaseDeleteArgs
> {
  constructor() {
    super(prisma.purchase);
  }
}
