import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useAuth } from '../useAuth';

import { vendorService } from '@/services/vendorService';

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  created_at: string;
  last_used_at: string | null;
  expires_at?: string | null;
  is_active: boolean;
}

export interface CreateApiKeyResponse {
  id: string;
  name: string;
  key: string; // Full API key that's only shown once
  keyPrefix: string;
  scopes: string[];
  created_at: string;
  expires_at?: string | null;
}

export interface CreateApiKeyRequest {
  name: string;
  scopes?: string[];
  expiresIn?: number; // days
}

export function useApiKeys() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const vendorId = profile?.data?.user.vendorData?.vendorId;

  const getApiKeys = async (): Promise<ApiKey[]> => {
    if (!vendorId) return [];
    return vendorService.getApiKeys(vendorId);
  };

  const createApiKey = async (
    request: CreateApiKeyRequest
  ): Promise<CreateApiKeyResponse> => {
    if (!vendorId) throw new Error('Vendor ID is required');
    return vendorService.createApiKey(vendorId, request);
  };

  const deleteApiKey = async (apiKeyId: string): Promise<void> => {
    if (!vendorId) throw new Error('Vendor ID is required');
    return vendorService.deleteApiKey(vendorId, apiKeyId);
  };

  const apiKeysQuery = useQuery({
    queryKey: ['apiKeys', vendorId],
    queryFn: getApiKeys,
    enabled: !!vendorId, // Only run if vendorId exists
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const createApiKeyMutation = useMutation({
    mutationFn: createApiKey,
    onSuccess: () => {
      // Invalidate the API keys query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['apiKeys', vendorId] });
    },
    onError: (error) => {
      toast.error('Error creating API key', {
        description:
          error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  });

  const deleteApiKeyMutation = useMutation({
    mutationFn: deleteApiKey,
    onSuccess: () => {
      // Invalidate the API keys query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['apiKeys', vendorId] });
      toast.success('API key revoked', {
        description: 'The API key has been permanently revoked.'
      });
    },
    onError: (error) => {
      toast.error('Error revoking API key', {
        description:
          error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  });

  return {
    apiKeys: apiKeysQuery.data || [],
    isLoading: apiKeysQuery.isLoading,
    isError: apiKeysQuery.isError,
    error: apiKeysQuery.error,
    createApiKey: createApiKeyMutation.mutate,
    isCreating: createApiKeyMutation.isPending,
    deleteApiKey: deleteApiKeyMutation.mutate,
    isDeleting: deleteApiKeyMutation.isPending,
    refetch: apiKeysQuery.refetch
  };
}
