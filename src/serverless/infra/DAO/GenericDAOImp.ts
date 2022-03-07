import GenericDAO from './GenericDAO';
import { Delegate } from './Delegate';

export default abstract class GenericDAOImp<C, R, U, D> implements GenericDAO<C, R, U, D> {
  private readonly entity: Delegate;

  constructor(entity: Delegate) {
    this.entity = entity;
  }

  async add(data: C): Promise<unknown> {
    const result = await this.entity.create({
      data,
    });
    return result;
  }

  async findById(data: R): Promise<unknown> {
    const result = await this.entity.findUnique(data);
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async update(data: U): Promise<unknown> {
    console.log(data);
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  async delete(id: D): Promise<void> {
    console.log(id);
    throw new Error('Method not implemented.');
  }
}
