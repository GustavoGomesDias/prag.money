import { Prisma } from '@prisma/client';
import PayWithModel from '../../data/models/PayWithModel';
import PurchaseModel from '../../data/models/PurchaseModel';
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

  async returnsPurchaseByAcquisitionsList(acquisitions: PayWithModel[]): Promise<PurchaseModel[] | undefined> {
    if (acquisitions.length === 0) {
      return undefined;
    }

    const getAllPurchases = acquisitions.map(async (acquisition) => {
      const purchase = await this.findUnique({
        where: {
          id: acquisition.purchase_id,
        },
      }) as PurchaseModel[];

      return purchase;
    });

    const purchases = await Promise.all(getAllPurchases) as unknown as PurchaseModel[];

    return purchases;
  }
}
