import GenericDAO from './GenericDAO';

/* eslint-disable semi */
export default interface ExtendGenericDAO<C, R, U, D, T> extends GenericDAO<C, R, U, D> {
  findMany(data: T): Promise<unknown>
}
