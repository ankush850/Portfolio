export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  date: string;
}

export const INITIAL_MESSAGES: GuestbookEntry[] = [];