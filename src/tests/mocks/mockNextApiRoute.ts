import { NextApiRequest, NextApiResponse } from 'next';

const mockNextApiRoute = jest.fn(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const result = await Promise.resolve(res.status(200).json({ message: 'ok!' }));
  return result;
});

export default mockNextApiRoute;
