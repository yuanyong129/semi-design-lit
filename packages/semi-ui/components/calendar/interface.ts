export type CalendarEventType = 'info' | 'success' | 'warning' | 'danger';

export interface CalendarEvent {
  date: string;
  content: string;
  type?: CalendarEventType;
}
