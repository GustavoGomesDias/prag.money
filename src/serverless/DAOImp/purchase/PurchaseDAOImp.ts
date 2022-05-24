/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { Prisma } from '@prisma/client';
import { checkIfExists404code } from '../../api/helpers/Validations';
import PayWithModel from '../../data/models/PayWithModel';
import PurchaseModel from '../../data/models/PurchaseModel';
import prisma from '../../data/prisma/config';
import { BadRequestError, NotFoundError } from '../../error/HttpError';
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

  async returnsPurchaseByAcquisitionsList(acquisitions: PayWithModel[]): Promise<PurchaseModel[]> {
    if (acquisitions.length > 0) {
      const getAllPurchases = acquisitions.map(async (acquisition) => {
        const purchase = await this.findUnique({
          where: {
            id: acquisition.purchase_id,
          },
        }) as PurchaseModel;

        return purchase;
      });

      const purchases = await Promise.all(getAllPurchases) as unknown as PurchaseModel[];

      if (purchases[0] === null || purchases[0] === undefined || purchases.length <= 0) {
        throw new NotFoundError('Algo de errado não está certo. Não foi possível encontrar compras para assa aquisição.');
      }

      return purchases;
    }
    throw new BadRequestError('Não há compras relacionadas a essa forma de pagamento.');
  }

  async deletePurchasesByAcquisisitionList(acquisitions: PayWithModel[]) {
    for (const ac of acquisitions) {
      await this.delete({
        where: {
          id: ac.purchase_id,
        },
      });
    }
  }

  async checkIfPurchaseExists(purchaseId: number): Promise<PurchaseModel> {
    const purchase = await this.findUnique({
      where: {
        id: purchaseId,
      },
    }) as unknown as PurchaseModel | undefined | null;
    checkIfExists404code(purchase, 'Compra/gasto não encontrada.');

    return purchase as PurchaseModel;
  }
}
