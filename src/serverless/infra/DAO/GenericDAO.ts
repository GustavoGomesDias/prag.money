export default interface GenericDAO<C, R, U, D> {
  add(data: C): Promise<unknown>
  findById(id: number): Promise<unknown>
  update(data: unknown): Promise<unknown>
  delete(id: number): Promise<void>
}