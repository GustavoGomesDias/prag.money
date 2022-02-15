import PaymentModel from "../../data/models/PaymentModel";
import { HttpResponse, ok } from "../helpers/http";

export default class PaymentController {
  async handleAdd(paymentInfos: PaymentModel): Promise<HttpResponse> {

    return ok('Forma de pagamento criado com sucesso!');
  }
}