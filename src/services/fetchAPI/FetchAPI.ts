import { FetchReturns, HeaderPropertie } from '../../types/FetchAPI';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default class FetchAPI {
  private readonly apiURL: string;

  private headers: Headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  constructor(apiURL: string) {
    this.apiURL = apiURL;
  }

  async get(): Promise<FetchReturns> {
    const result = await fetch(this.apiURL, {
      method: 'GET',
      headers: this.headers,
    });

    const data = await result.json();

    return {
      statusCode: result.status,
      data,
    };
  }

  async post(info: any): Promise<FetchReturns> {
    const result = await fetch(this.apiURL, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(info),
    });

    const data = await result.json();

    return {
      statusCode: result.status,
      data,
    };
  }

  setHeader({ headerName, content }: HeaderPropertie): void {
    this.headers.set(headerName, content);
  }

  getHeader(headerName: string): string | null {
    return this.headers.get(headerName);
  }
}
