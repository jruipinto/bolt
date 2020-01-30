export interface Message {
  id: number;
  phoneNumber: number;
  subject: string;
  text: string;
  /**
 * Possible states:
 *  for incoming messages:
 *    unread
 *    read
 *  for outgoing messages:
 *    pending (waiting report)
 *    unreachable (report says that address isn´t availble in this moment)
 *    error  (try again. verify modem connected, signal or money balance)
 *    delivered
 */
  state: 'unread' | 'read' | 'pending' | 'unreachable' | 'error' | 'delivered';
  tecnico_user_id: number;
  submitedAt: Date;
  deliveredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
