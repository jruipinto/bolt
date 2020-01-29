export interface Message {
  phoneNumber: number;
  subject: string;
  text: string;
  state: string;
  tecnico_user_id: number;
  submitedAt: Date;
  deliveredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
