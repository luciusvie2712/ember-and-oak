export type CreatePrivateEventEnquiryInput = Readonly<{
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guests: number;
  eventType: string;
  budget?: string | undefined;
  message?: string | undefined;
}>;

export type PrivateEventEnquiryReceipt = Readonly<{
  id: string;
  receivedAt: string;
}>;
