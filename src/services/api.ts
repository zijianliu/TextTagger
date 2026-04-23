import { ClassificationResult, BatchClassificationRequest, BatchClassificationResponse, HistoryFilter } from '@/types';

export const classifyText = async (text: string): Promise<ClassificationResult> => {
  const response = await fetch('/api/classify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });
  
  if (!response.ok) {
    throw new Error('Classification failed');
  }
  
  return response.json();
};

export const batchClassify = async (texts: string[]): Promise<BatchClassificationResponse> => {
  const response = await fetch('/api/batch-classify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ texts })
  });
  
  if (!response.ok) {
    throw new Error('Batch classification failed');
  }
  
  return response.json();
};

export const getHistory = async (filter?: HistoryFilter): Promise<ClassificationResult[]> => {
  const params = new URLSearchParams();
  if (filter?.category) {
    params.append('category', filter.category);
  }
  
  const response = await fetch(`/api/history${params.toString() ? `?${params.toString()}` : ''}`);
  
  if (!response.ok) {
    throw new Error('Failed to get history');
  }
  
  return response.json();
};

export const uploadFile = async (file: File): Promise<BatchClassificationResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('File upload failed');
  }
  
  return response.json();
};