/* eslint-disable @typescript-eslint/no-explicit-any */
import { FetchReturns, FetchAPIHeader } from '../../types/FetchAPI';

export default class FetchAPI<T> {
  private readonly apiURL: string;

  private headers: FetchAPIHeader;

  constructor(apiURL: string) {
    this.apiURL = apiURL;

    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: '',
    };
  }

  async get(complementUrl: string): Promise<FetchReturns<T>> {
    const result = await fetch(`${this.apiURL}/${complementUrl}`, {
      method: 'GET',
      headers: { ...this.headers },
    });

    const data = await result.json() as T;

    return {
      statusCode: result.status,
      data,
    };
  }

  async post(complementUrl: string, info: any): Promise<FetchReturns<T>> {
    const result = await fetch(`${this.apiURL}/${complementUrl}`, {
      method: 'POST',
      headers: { ...this.headers },
      body: JSON.stringify(info),
    });

    const data = await result.json() as T;

    return {
      statusCode: result.status,
      data,
    };
  }

  setAuthHeader(content: string): void {
    this.headers = {
      ...this.headers,
      Authorization: content,
    };
  }

  getHeader(): FetchAPIHeader {
    return this.headers;
  }
}
