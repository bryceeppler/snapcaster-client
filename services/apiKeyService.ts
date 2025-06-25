import axiosInstance from '@/utils/axiosWrapper';

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  lastUsedAt?: string | null;
  createdAt: string;
  expiresAt?: string | null;
  revokedAt?: string | null;
}

export interface CreateApiKeyResponse {
  id: string;
  name: string;
  key: string; // Only returned on creation
  keyPrefix: string;
  scopes: string[];
  createdAt: string;
  expiresAt?: string | null;
}

export interface CreateApiKeyRequest {
  name: string;
  scopes?: string[];
  expiresIn?: number; // days
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiKeyService = {
  /**
   * List all API keys for the authenticated user
   */
  async listApiKeys(): Promise<ApiKey[]> {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/v1/auth/api-keys`
    );
    return response.data.data;
  },

  /**
   * Create a new API key
   */
  async createApiKey(data: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/v1/auth/api-keys`,
      data
    );
    return response.data.data;
  },

  /**
   * Revoke an API key
   */
  async revokeApiKey(apiKeyId: string): Promise<void> {
    await axiosInstance.delete(`${BASE_URL}/api/v1/auth/api-keys/${apiKeyId}`);
  },

  /**
   * Get a specific API key (without the secret)
   */
  async getApiKey(apiKeyId: string): Promise<ApiKey> {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/v1/auth/api-keys/${apiKeyId}`
    );
    return response.data.data;
  },

  /**
   * Reveal the full API key
   */
  async revealApiKey(apiKeyId: string): Promise<{ key: string }> {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/v1/auth/api-keys/${apiKeyId}/reveal`
    );
    return response.data.data;
  }
};
