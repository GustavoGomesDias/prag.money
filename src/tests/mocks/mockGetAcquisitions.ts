import GetAcquisitions from '../../serverless/data/usecases/GetAcquisitions';

const purchaseDate = new Date('2022-05-20T18:33:18.189Z');
const mockGetAcquisitions: GetAcquisitions = {
  PayWith: {
    id: 1,
    payment_id: 1,
    purchase_id: 1,
    value: 1,
    purchase: {
      created_at: purchaseDate.toString(),
    },
  },

  id: 1,
  current_month: 1,
  default_value: 1,
  nickname: 'nickname',
  reset_day: 1,
  user_id: 1,
  current_value: 1,
};

export default mockGetAcquisitions;
