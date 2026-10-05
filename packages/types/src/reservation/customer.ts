export type Customer = Readonly<{
  id: string;
  name: string;
  email: string;
  phone: string;
  vipTag?: string;
  createdAt: string;
  updatedAt: string;
}>;

export type ReservationGuest = Readonly<{
  name: string;
  email: string;
  phone: string;
}>;
