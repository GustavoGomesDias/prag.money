import GenericDAOImp from './GenericDAOImp';
import ExtendGenericDAO from './ExtendGenericDAO';
import { Delegate } from './Delegate';

export default abstract class ExtendGenericDAOImp<C, R, U, D, T> extends GenericDAOImp<C, R, U, D> implements ExtendGenericDAO<C, R, U, D, T> {
  constructor(entity: Delegate) {
    super(entity);
  }

  async findMany(data: T): Promise<unknown> {
    const result = await this.entity.findMany(data);
    return result;
  }
}
