/* eslint-disable semi */
export default interface GenericDAO<C, R, U, D> {
  add(data: C): Promise<unknown>
  findUnique(data: R): Promise<unknown>
  update(data: U): Promise<unknown>
  delete(id: D): Promise<void>
}
