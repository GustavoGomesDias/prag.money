import GenericDAO from './GenericDAO';
import { Delegate } from './Delegate';

export default abstract class GenericDAOImp<C, R, U, D> implements GenericDAO<C, R, U, D> {
  public readonly entity: Delegate;

  constructor(entity: Delegate) {
    this.entity = entity;
  }

  async add(data: C): Promise<unknown> {
    const result = await this.entity.create({
      data,
    });
    return result;
  }

  async findUnique(data: R): Promise<unknown> {
    const result = await this.entity.findUnique(data);
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async update(data: U): Promise<unknown> {
    const result = await this.entity.update(data);
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async delete(data: D): Promise<void> {
    await this.entity.delete(data);
  }
}
