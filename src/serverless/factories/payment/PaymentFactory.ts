import PaymentController from '../../api/controllers/PaymentController';
import PaymentDAOImp from '../../DAOImp/payment/PaymentDAOImp';

export default function makePaymentController(): PaymentController {
  const paymentRepository = new PaymentDAOImp();
  return new PaymentController(paymentRepository);
}
