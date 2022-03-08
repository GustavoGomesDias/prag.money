/* eslint-disable @typescript-eslint/no-explicit-any */
import { FetchReturns, HeaderPropertie } from '../../types/FetchAPI';

export default class FetchAPI<T> {
  private readonly apiURL: string;

  private headers: Headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  constructor(apiURL: string) {
    this.apiURL = apiURL;
  }

  async get(complementUrl: string): Promise<FetchReturns<T>> {
    const result = await fetch(`${this.apiURL}/${complementUrl}`, {
      method: 'GET',
      headers: this.headers,
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
      headers: this.headers,
      body: JSON.stringify(info),
    });

    const data = await result.json() as T;

    return {
      statusCode: result.status,
      data,
    };
  }

  setHeader({ headerName, content }: HeaderPropertie): void {
    this.headers.set(headerName, content);
  }

  getHeader(): Headers {
    return this.headers;
  }
}
