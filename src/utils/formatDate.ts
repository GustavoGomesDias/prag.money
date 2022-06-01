const formatDate = (date: Date): string => `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/${(date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)}/${date.getFullYear()}`;

export default formatDate;
