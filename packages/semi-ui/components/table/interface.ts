import { TemplateResult } from 'lit';

export interface TableColumn<RecordType = any> {
  title: string;
  dataIndex?: string;
  key?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render?: (text: any, record: RecordType, index: number) => TemplateResult | string | number;
}

export type TableRowKey<RecordType = any> =
  | string
  | ((record: RecordType, index: number) => string | number);
