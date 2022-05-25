import PurchaseDAOImp from '../../DAOImp/purchase/PurchaseDAOImp';
import PurchaseModel from '../../data/models/PurchaseModel';
import Catch from '../../decorators/Catch';
import { HttpResponse, okWithContent } from '../helpers/http';
import { checkIsEquals403Error, validationId } from '../helpers/Validations';

export default class PurchaseController {
  private readonly purchaseDAO: PurchaseDAOImp;

  constructor(purchaseDAO: PurchaseDAOImp) {
    this.purchaseDAO = purchaseDAO;
  }

  @Catch()
  async handleGetPurchaseById(purchaseId: number, userId: number): Promise<HttpResponse> {
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
            id: true,
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
  }
}
