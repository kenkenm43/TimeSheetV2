export const calOT = (salary: number) => {
  const total = (salary / 30 / 8) * 1.5 * 8;
  return total;
};

export const calSSO = (salary: number) => {
  const total = salary * 0.05 >= 750 ? 750 : salary * 0.05;
  return total;
};
