/* eslint-disable import/prefer-default-export */
export class TokenExpired extends Error {
  constructor() {
    super('Token expirou. Faça login novamente.');
    this.name = 'TokenExpired';
  }
}
