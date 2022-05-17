import PurchaseDAOImp from '../../DAOImp/purchase/PurchaseDAOImp';
import handleErrors from '../../error/helpers/handleErrors';
import { HttpResponse, okWithContent } from '../helpers/http';
import { validationId } from '../helpers/Validations';

export default class PurchaseController {
  private readonly purchaseDAO: PurchaseDAOImp;

  constructor(purchaseDAO: PurchaseDAOImp) {
    this.purchaseDAO = purchaseDAO;
  }

  async handleGetPurchaseById(purchaseId: number): Promise<HttpResponse> {
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
            },
          },
          description: true,
          id: true,
          purchase_date: true,
          value: true,
        },
      });

      return okWithContent({ purchase });
    } catch (err) {
      console.log(err);
      return handleErrors(err as Error);
    }
  }
}
