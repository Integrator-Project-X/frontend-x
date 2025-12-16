export type RegisterPayload = {
  full_name: string;
  age: number;
  address: string;
  phone_number: string;
  identification_number: string;
  id_gender: number;
  email: string;
  password: string;
};

export type GenderOption = {
  id: number;
  name: string;
  isActive?: boolean;
};
