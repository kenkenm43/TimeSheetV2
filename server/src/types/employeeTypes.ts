export type EmployeeType = {
  id?: string;
  firstName: string;
  lastName: string;
  gender: string;
  idCard: string;
  date_of_birth?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  photo?: string;
  System_Access?: SystemAccess;
};

export type SystemAccess = {
  access_id: string;
  username: string;
  password: string;
  access_rights: string;
  employeeId: string;
  refreshToken: string;
};
