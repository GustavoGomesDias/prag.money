export interface Delegate {
  aggregate(data: unknown): Promise<unknown>;
  count(data: unknown): Promise<unknown>;
  create(data: unknown): Promise<unknown>;
  delete(data: unknown): Promise<unknown>;
  deleteMany(data: unknown): Promise<unknown>;
  findFirst(data: unknown): Promise<unknown>;
  findMany(data: unknown): Promise<unknown>;
  findUnique(data: unknown): Promise<unknown>;
  update(data: unknown): Promise<unknown>;
  updateMany(data: unknown): Promise<unknown>;
  upsert(data: unknown): Promise<unknown>;
}
