export const isValidString = (value: any) => typeof value === 'string' && value.trim().length > 1;

export const isValidNumber = (value: any) => typeof value === 'number' && value > 0;

