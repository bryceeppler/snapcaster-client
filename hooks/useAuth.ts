import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { tokenManager } from '@/utils/axiosWrapper';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Use React Query to manage token state
  const { data: accessToken } = useQuery({
    queryKey: ['auth-token'],
    queryFn: () => tokenManager.accessToken,
    staleTime: Infinity,
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

  // Login mutation
  const {
    mutate: login,
    isPending: isLoggingIn,
    error: loginError
  } = useMutation({
    mutationFn: authService.login,
    onSuccess: (token) => {
      setAccessToken(token);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Login successful!');
      router.push('/profile');
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
      router.push('/profile');
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
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authService.resetPassword(token, newPassword),
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

    resendVerificationEmail,
    isResendingVerification,
    resendVerificationError,
  };
} 