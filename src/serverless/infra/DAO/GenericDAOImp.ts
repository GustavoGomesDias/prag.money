import GenericDAO from './GenericDAO';
import { Delegate } from './Delegate';

export default abstract class GenericDAOImp<C, R, U, D> implements GenericDAO<C, R, U, D> {
  private readonly entity: Delegate;

  constructor (entity: Delegate) {
    this.entity = entity;
  }

  async add(data: C): Promise<unknown> {
    return await this.entity.create({
      data: data,
    });
  }
  async findById(id: number): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  async update(data: unknown): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  async delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

}