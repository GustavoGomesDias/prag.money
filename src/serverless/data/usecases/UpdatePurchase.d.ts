/* eslint-disable semi */
import AddPurchase from './AddPurchase';

export default interface UpdatePurchase extends AddPurchase {
  payWithDeleteds: number[]
}
