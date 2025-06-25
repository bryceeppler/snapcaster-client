import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';
import { apiKeyService, ApiKey, CreateApiKeyRequest, CreateApiKeyResponse } from '@/services/apiKeyService';

export function useUserApiKeys() {
  const queryClient = useQueryClient();
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  // Query for fetching API keys
  const apiKeysQuery = useQuery({
    queryKey: ['userApiKeys'],
    queryFn: apiKeyService.listApiKeys,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation for creating API key
  const createApiKeyMutation = useMutation({
    mutationFn: (data: CreateApiKeyRequest) => apiKeyService.createApiKey(data),
    onSuccess: (data: CreateApiKeyResponse) => {
      // Store the full key temporarily for display
      setNewlyCreatedKey(data.key);
      
      // Invalidate the query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['userApiKeys'] });
      
      toast.success('API key created', {
        description: 'Make sure to copy your API key now. You won\'t be able to see it again!',
        duration: 10000, // Show for 10 seconds
      });
    },
    onError: (error) => {
      toast.error('Error creating API key', {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  });

  // Mutation for revoking API key
  const revokeApiKeyMutation = useMutation({
    mutationFn: (apiKeyId: string) => apiKeyService.revokeApiKey(apiKeyId),
    onSuccess: () => {
      // Invalidate the query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['userApiKeys'] });
      
      toast.success('API key revoked', {
        description: 'The API key has been permanently revoked and can no longer be used.',
      });
    },
    onError: (error) => {
      toast.error('Error revoking API key', {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  });

  // Function to clear the newly created key from state
  const clearNewlyCreatedKey = () => {
    setNewlyCreatedKey(null);
  };

  return {
    // Data
    apiKeys: apiKeysQuery.data || [],
    newlyCreatedKey,
    
    // Loading states
    isLoading: apiKeysQuery.isLoading,
    isCreating: createApiKeyMutation.isPending,
    isRevoking: revokeApiKeyMutation.isPending,
    
    // Error states
    isError: apiKeysQuery.isError,
    error: apiKeysQuery.error,
    
    // Actions
    createApiKey: createApiKeyMutation.mutate,
    revokeApiKey: revokeApiKeyMutation.mutate,
    clearNewlyCreatedKey,
    refetch: apiKeysQuery.refetch,
  };
}