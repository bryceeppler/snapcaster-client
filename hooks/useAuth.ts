import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import { tokenManager } from '@/utils/axiosWrapper';
import { useCallback, useState } from 'react';

// Create a compatibility layer for router
function useCompatRouter() {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';

  // Simple navigation function that works in both routers
  const push = useCallback(
    (path: string) => {
      if (isBrowser) {
        window.location.href = path;
      }
    },
    [isBrowser]
  );

  return { push };
}

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useCompatRouter();

  // Use React Query to manage token state
  const { data: accessToken } = useQuery({
    queryKey: ['auth-token'],
    queryFn: () => tokenManager.accessToken,
    staleTime: Infinity
  });

  // Helper function to set access token
  const setAccessToken = (token: string | null) => {
    tokenManager.setAccessToken(token);
    queryClient.setQueryData(['auth-token'], token);
  };

  // Initial auth check using React Query
  const {
    isLoading: isInitializing,
    isSuccess: isInitialized,
    error: initError
  } = useQuery({
    queryKey: ['auth-init'],
    queryFn: async () => {
      if (!accessToken) {
        const token = await authService.refreshToken();
        setAccessToken(token);
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      }
      return null;
    },
    // Only run this once when the component mounts
    staleTime: Infinity,
    retry: false,
    // Don't refetch on window focus or reconnect
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  // Query for user profile
  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => authService.getProfile(),
    enabled: !!accessToken && isInitialized,
    retry: false
  });

  // Add these to your useAuth hook state
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);

  // Login mutation
  const {
    mutate: login,
    isPending: isLoggingIn,
    error: loginError
  } = useMutation({
    mutationFn: authService.login,
    onSuccess: (result) => {
      // Check if 2FA is required
      if (typeof result === 'object' && result.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setTempToken(result.tempToken);
        // Don't set the access token or redirect yet
        return;
      }

      // Regular login success
      const token = result as string;
      setAccessToken(token);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Login successful!');
      router.push('/account');
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred during login');
      }
      console.error('Login error:', error);
    }
  });

  // Add a mutation for completing 2FA login
  const {
    mutate: completeTwoFactorLogin,
    isPending: isCompletingTwoFactorLogin,
    error: twoFactorLoginError
  } = useMutation({
    mutationFn: ({
      tempToken,
      twoFactorCode
    }: {
      tempToken: string;
      twoFactorCode: string;
    }) => authService.completeTwoFactorLogin(tempToken, twoFactorCode),
    onSuccess: (token) => {
      setAccessToken(token);
      setRequiresTwoFactor(false);
      setTempToken(null);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Login successful!');
      router.push('/account');
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Invalid verification code');
      }
      console.error('2FA login error:', error);
    }
  });

  // Register mutation
  const {
    mutate: register,
    isPending: isRegistering,
    error: registerError
  } = useMutation({
    mutationFn: authService.register,
    onSuccess: (response) => {
      setAccessToken(response.data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Registration successful!');
      router.push('/account');
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred during registration');
      }
      console.error('Registration error:', error);
    }
  });

  // Logout mutation
  const {
    mutate: logout,
    isPending: isLoggingOut,
    error: logoutError
  } = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      setAccessToken(null);
      queryClient.clear(); // Clear all queries from cache
      router.push('/');
      toast.success('Logged out successfully');
    },
    onError: (error) => {
      toast.error('Error logging out');
      console.error('Logout error:', error);
    }
  });

  // Forgot password mutation
  const {
    mutate: forgotPassword,
    isPending: isRequestingPasswordReset,
    error: forgotPasswordError
  } = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      toast.success('Password reset instructions sent to your email');
    },
    onError: (error) => {
      toast.error('Error requesting password reset');
      console.error('Forgot password error:', error);
    }
  });

  // Reset password mutation
  const {
    mutate: resetPassword,
    isPending: isResettingPassword,
    error: resetPasswordError
  } = useMutation({
    mutationFn: ({
      token,
      newPassword
    }: {
      token: string;
      newPassword: string;
    }) => authService.resetPassword(token, newPassword),
    onSuccess: () => {
      toast.success('Password reset successfully');
      router.push('/signin');
    },
    onError: (error) => {
      toast.error('Error resetting password');
      console.error('Reset password error:', error);
    }
  });

  // Discord connection mutations
  const {
    mutate: connectDiscord,
    isPending: isConnectingDiscord,
    error: connectDiscordError
  } = useMutation({
    mutationFn: authService.connectDiscord,
    onSuccess: (response) => {
      window.location.href = response.data.url;
    },
    onError: (error) => {
      toast.error('Error connecting to Discord');
      console.error('Discord connection error:', error);
    }
  });

  // Resend verification email mutation
  const {
    mutate: resendVerificationEmail,
    isPending: isResendingVerification,
    error: resendVerificationError
  } = useMutation({
    mutationFn: authService.resendVerificationEmail,
    onSuccess: () => {
      toast.success('Verification email sent! Please check your inbox.');
    },
    onError: (error) => {
      toast.error('Error sending verification email');
      console.error('Resend verification error:', error);
    }
  });

  const {
    mutate: disconnectDiscord,
    isPending: isDisconnectingDiscord,
    error: disconnectDiscordError
  } = useMutation({
    mutationFn: authService.disconnectDiscord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Discord disconnected successfully');
    },
    onError: (error) => {
      toast.error('Error disconnecting from Discord');
      console.error('Discord disconnection error:', error);
    }
  });

  // 2FA setup mutation for authenticator app
  const setupApp2FAMutation = useMutation({
    mutationFn: () => authService.setupApp2FA(),
    onSuccess: (data) => {
      // Data contains secret, qrCode, and backupCodes
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error) => {
      toast.error('Error setting up app-based 2FA');
      console.error('App 2FA setup error:', error);
    }
  });

  // Create a wrapper function that allows passing additional callbacks
  const setupApp2FA = (
    params?: undefined,
    options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: Error) => void;
    }
  ) => {
    return setupApp2FAMutation.mutate(params, {
      onSuccess: (data) => {
        // Call the default onSuccess behavior (invalidate queries)
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        // Call the additional onSuccess if provided
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error('Error setting up app-based 2FA');
        console.error('App 2FA setup error:', error);
        // Call the additional onError if provided
        options?.onError?.(error);
      }
    });
  };

  const isSettingUpApp2FA = setupApp2FAMutation.isPending;
  const setupApp2FAError = setupApp2FAMutation.error;

  // 2FA setup mutation for email
  const {
    mutate: setupEmail2FA,
    isPending: isSettingUpEmail2FA,
    error: setupEmail2FAError
  } = useMutation({
    mutationFn: () => authService.setupEmail2FA(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Email-based 2FA enabled successfully!');
    },
    onError: (error) => {
      toast.error('Error setting up email-based 2FA');
      console.error('Email 2FA setup error:', error);
    }
  });

  // 2FA verification mutation for authenticator app
  const verifyApp2FAMutation = useMutation({
    mutationFn: ({
      token,
      secret = '',
      method = ''
    }: {
      token: string;
      secret?: string;
      method?: string;
    }) => authService.verifyApp2FA(token, secret, method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('App-based 2FA enabled successfully!');
    },
    onError: (error) => {
      toast.error('Error verifying 2FA code');
      console.error('App 2FA verification error:', error);
    }
  });

  // Create a wrapper function that allows passing additional callbacks
  const verifyApp2FA = (
    params: { token: string; secret?: string; method?: string },
    options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }
  ) => {
    return verifyApp2FAMutation.mutate(params, {
      onSuccess: () => {
        // Call the default onSuccess behavior
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        toast.success('App-based 2FA enabled successfully!');
        // Call the additional onSuccess if provided
        options?.onSuccess?.();
      },
      onError: (error) => {
        toast.error('Error verifying 2FA code');
        console.error('App 2FA verification error:', error);
        // Call the additional onError if provided
        options?.onError?.(error);
      }
    });
  };

  const isVerifyingApp2FA = verifyApp2FAMutation.isPending;
  const verifyApp2FAError = verifyApp2FAMutation.error;

  // 2FA disable mutation
  const {
    mutate: disable2FA,
    isPending: isDisabling2FA,
    error: disable2FAError
  } = useMutation({
    mutationFn: (token: string) => authService.disable2FA(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('2FA disabled successfully');
    },
    onError: (error) => {
      toast.error('Error disabling 2FA');
      console.error('2FA disable error:', error);
    }
  });

  return {
    // Auth state
    accessToken,
    isAuthenticated: !!accessToken,
    isInitializing,

    // User profile
    profile,
    isLoadingProfile,
    profileError,
    hasActiveSubscription: profile?.data?.user?.subscription === 'active',
    isAdmin: profile?.data?.user?.role === 'ADMIN',
    isVendor: profile?.data?.user?.role === 'VENDOR',

    // Auth methods
    login,
    isLoggingIn,
    loginError,

    register,
    isRegistering,
    registerError,

    logout,
    isLoggingOut,
    logoutError,

    // Password reset
    forgotPassword,
    isRequestingPasswordReset,
    forgotPasswordError,

    resetPassword,
    isResettingPassword,
    resetPasswordError,

    // Discord integration
    connectDiscord,
    isConnectingDiscord,
    connectDiscordError,

    disconnectDiscord,
    isDisconnectingDiscord,
    disconnectDiscordError,

    // Verification
    resendVerificationEmail,
    isResendingVerification,
    resendVerificationError,

    // 2FA methods - App based
    setupApp2FA,
    isSettingUpApp2FA,
    setupApp2FAError,

    verifyApp2FA,
    isVerifyingApp2FA,
    verifyApp2FAError,

    // 2FA methods - Email based
    setupEmail2FA,
    isSettingUpEmail2FA,
    setupEmail2FAError,

    // Disable 2FA
    disable2FA,
    isDisabling2FA,
    disable2FAError,

    // 2FA login state and methods
    requiresTwoFactor,
    tempToken,
    completeTwoFactorLogin,
    isCompletingTwoFactorLogin,
    twoFactorLoginError
  };
}
