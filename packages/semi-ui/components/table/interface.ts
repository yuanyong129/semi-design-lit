import { TemplateResult } from 'lit';

export type TableSortOrder = 'ascend' | 'descend' | null;
export type TableRowKeyValue = string | number;

export interface TableFilterOption {
  text: string;
  value: string | number | boolean;
}

export interface TableColumn<RecordType = any> {
  title: string;
  dataIndex?: string;
  key?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sorter?: boolean | ((a: RecordType, b: RecordType) => number);
  sortOrder?: TableSortOrder;
  filters?: TableFilterOption[];
  filterMultiple?: boolean;
  onFilter?: (value: string | number | boolean, record: RecordType) => boolean;
  render?: (text: any, record: RecordType, index: number) => TemplateResult | string | number;
}

export interface TablePaginationConfig {
  pageSize?: number;
  currentPage?: number;
  showTotal?: boolean;
  onChange?: (currentPage: number, pageSize: number) => void;
}

export interface TableRowSelection<RecordType = any> {
  selectedRowKeys?: TableRowKeyValue[];
  defaultSelectedRowKeys?: TableRowKeyValue[];
  onChange?: (selectedRowKeys: TableRowKeyValue[], selectedRows: RecordType[]) => void;
  getCheckboxProps?: (record: RecordType) => { disabled?: boolean };
}

export type TableRowKey<RecordType = any> =
  | string
  | ((record: RecordType, index: number) => string | number);
