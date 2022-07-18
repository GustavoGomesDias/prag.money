import qrcode from 'qrcode';

const generateUrlQRCODE = async (url: string) => {
  const qr = await qrcode.toDataURL(url);
  return qr;
};

export default generateUrlQRCODE;
