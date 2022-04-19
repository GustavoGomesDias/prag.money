export namespace PMoneyErrors {
  export class TokenExpired extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'TokenExpired';
    }
  }
}
