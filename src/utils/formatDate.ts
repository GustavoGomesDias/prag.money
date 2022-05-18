const formatDate = (date: Date): string => {
  const setedDate = new Date(date);
  setedDate.setDate(setedDate.getDate() + 1);
  return `${setedDate.getDate()}/${setedDate.getMonth() + 1}/${setedDate.getFullYear()}`;
};

export default formatDate;
