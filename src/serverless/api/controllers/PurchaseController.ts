import PurchaseDAOImp from '../../DAOImp/purchase/PurchaseDAOImp';
import PurchaseModel from '../../data/models/PurchaseModel';
import handleErrors from '../../error/helpers/handleErrors';
import { HttpResponse, okWithContent } from '../helpers/http';
import { checkIsEquals403Error, validationId } from '../helpers/Validations';

export default class PurchaseController {
  private readonly purchaseDAO: PurchaseDAOImp;

  constructor(purchaseDAO: PurchaseDAOImp) {
    this.purchaseDAO = purchaseDAO;
  }

  async handleGetPurchaseById(purchaseId: number, userId: number): Promise<HttpResponse> {
    try {
      validationId(purchaseId);

      const purchase = await this.purchaseDAO.findUnique({
        where: {
          id: purchaseId,
        },

        select: {
          PayWith: {
            select: {
              payment: true,
              value: true,
            },
          },
          description: true,
          id: true,
          purchase_date: true,
          value: true,
          user_id: true,
        },
      }) as PurchaseModel;

      checkIsEquals403Error(purchase.user_id, userId, 'Você não tem permissão para acessar este conteúdo.');

      return okWithContent({ purchase });
    } catch (err) {
      console.log(err);
      return handleErrors(err as Error);
    }
  }
}
