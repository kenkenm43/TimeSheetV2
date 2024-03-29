export type EmployeeType = {
  id?: string;
  firstName: string;
  lastName: string;
  idCard: string;
  gender: string;
  date_of_birth?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  photo?: string;
  jpb_title?: string;
  education_leveL?: string;
  experience?: string;
  createdAt?: string;
  updatedAt?: string;
  System_Access?: SystemAccess;
  Employment_Details?: Employment_Details;
  Leave?: Leave;
  Financial_Details?: Financial_Details;
  Performace?: Performance;
};

export type Employment_Details = {
  id?: string;
  position?: string;
  department?: string;
  contract_type?: string;
  start_date?: string;
  end_date?: string;
  salary?: string;
  salary_increase?: string;
  salary_decrease?: string;
  tax_information?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Leave = {
  id?: string;
  leave_type?: string;
  leave_cause?: string;
  start_date?: string;
  end_date?: string;
};

export type Performance = {
  id?: string;
  performance_rating?: string;
  feedback?: string;
};

export type Financial_Details = {
  id?: string;
  bank_account_number?: string;
  bank_name?: string;
  social_security_number?: string;
  health_insurance?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SystemAccess = {
  access_id: string;
  username: string;
  password: string;
  refreshToken: string;
  access_rights: string;
  role: Role;
  employeeId: string;
};
export type Role = {
  id: string;
  name: string;
};
