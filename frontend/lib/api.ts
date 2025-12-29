// frontend/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export interface RemoveBackgroundResponse {
  success: boolean;
  data: {
    image: string; // base64 encoded image
    original_filename: string;
    format: string;
    size: {
      width: number;
      height: number;
    };
  };
  timestamp: string;
}

/**
 * Remove background from a file and return base64 image
 */
export async function removeBackground(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/remove-background`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to remove background');
  }

  // 🔥 IMPORTANT FIX
  const blob = await response.blob();

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}


/**
 * Check API health
 */
export async function checkApiHealth(): Promise<{ service: string; status: string; version: string }> {
  const response = await fetch(`${API_BASE_URL}/`);
  
  if (!response.ok) {
    throw new Error('API is not available');
  }

  return response.json();
}