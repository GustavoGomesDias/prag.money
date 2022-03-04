import PaymentController from "../../api/controllers/PaymentController";
import PaymentRepository from "../../repositories/payment/PaymentRepository";

export function makePaymentController(): PaymentController {
  const paymentRepository = new PaymentRepository();
  return new PaymentController(paymentRepository);
}