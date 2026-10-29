export type UploadStatus = 'ready' | 'uploading' | 'success' | 'error';

export interface UploadFile {
  uid: string;
  name: string;
  size?: number;
  status: UploadStatus;
  percent?: number;
  url?: string;
  file?: File;
  error?: string;
}

export interface UploadRequestOptions {
  file: File;
  onProgress: (percent: number) => void;
  onSuccess: (response?: any) => void;
  onError: (error: Error) => void;
}
