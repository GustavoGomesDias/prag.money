/* eslint-disable import/prefer-default-export */
export const handleDate = (pruchaseDate: Date): Date => {
  const date = new Date(pruchaseDate).toISOString().split('T')[0];
  const year = Number(date.split('-')[0]);
  const month = Number(date.split('-')[1]);
  const day = Number(date.split('-')[2]);
  const setedDate = new Date(Date.UTC(year, month, day, 3, 0, 0));
  return setedDate;
};
