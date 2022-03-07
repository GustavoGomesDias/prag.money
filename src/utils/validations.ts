export const validationField = (field: string) => field === '' || field === ' ' || field === null || field === undefined;

export const validateEmail = (email: string) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase());

export const validationDay = (day: number) => day > 0 && day <= 31;
