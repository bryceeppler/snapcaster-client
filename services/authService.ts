import axiosInstance from '@/utils/axiosWrapper';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginCredentials {
  email: string;
  password: string;
  twoFactorToken?: string;
  tempToken?: string;
}

interface RegisterCredentials extends LoginCredentials {
  fullName: string;
}

interface RegisterResponse {
  status: string;
  data: {
    user: UserProfile;
    accessToken: string;
  };
}

interface AuthResponse {
  status: string;
  data: {
    accessToken: string;
  };
}

interface UserProfileResponse {
  status: string;
  data: UserProfile;
}

interface ConnectDiscordResponse {
  status: string;
  data: {
    url: string;
  };
}

interface VendorData {
  vendorId: number;
}

type UserRole = 'ADMIN' | 'VENDOR' | 'USER';

interface UserProfile {
  user: {
    id: string;
    email: string;
    fullName: string;
    emailVerified: boolean;
    discordId: string;
    discordUsername: string;
    discordEmail: string;
    subscription: string;
    createdAt: string;
    updatedAt: string;
    role: UserRole;
    twoFactorEnabled: boolean;
    vendorData?: VendorData;
  };
}

export class AuthService {
  async login(
    credentials: LoginCredentials
  ): Promise<string | { requiresTwoFactor: true; tempToken: string }> {
    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/login`,
      credentials,
      {
        withCredentials: true
      }
    );

    if (response.data.data.requiresTwoFactor) {
      return {
        requiresTwoFactor: true,
        tempToken: response.data.data.tempToken
      };
    }

    return response.data.data.accessToken;
  }

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/register`,
      credentials,
      {
        withCredentials: true
      }
    );
    return response.data;
  }

  async refreshToken(): Promise<string> {
    // No need to send the refresh token as it's in the HTTP-only cookie
    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/refresh`,
      {},
      {
        withCredentials: true
      }
    );
    return response.data.data.accessToken;
  }

  async getProfile(): Promise<UserProfileResponse> {
    const response = await axiosInstance.get(`${BASE_URL}/api/v1/auth/me`, {
      withCredentials: true
    });
    return response.data;
  }

  async forgotPassword(email: string): Promise<void> {
    await axios.post(`${BASE_URL}/api/v1/auth/password/forgot`, { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await axios.post(`${BASE_URL}/api/v1/auth/password/reset/${token}`, {
      password
    });
  }

  async connectDiscord(): Promise<ConnectDiscordResponse> {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/v1/auth/discord`,
      {
        withCredentials: true
      }
    );
    return response.data;
  }

  async disconnectDiscord(): Promise<void> {
    await axiosInstance.get(`${BASE_URL}/api/v1/auth/discord/disconnect`, {
      withCredentials: true
    });
  }

  async unsubscribe(token: string): Promise<void> {
    await axios.post(`${BASE_URL}/api/v1/auth/unsubscribe`, { token });
  }

  async logout(): Promise<void> {
    await axios.post(
      `${BASE_URL}/api/v1/auth/logout`,
      {},
      {
        withCredentials: true
      }
    );
  }

  async resendVerificationEmail(): Promise<void> {
    await axiosInstance.post(
      `${BASE_URL}/api/v1/auth/email/verification/resend`,
      {},
      {
        withCredentials: true
      }
    );
  }

  async setup2FA(): Promise<{
    secret: string;
    qrCode: string;
    backupCodes: string[];
  }> {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/v1/auth/2fa/setup`,
      {},
      {
        withCredentials: true
      }
    );
    return response.data.data;
  }

  async verify2FA(token: string, secret: string): Promise<void> {
    await axiosInstance.post(
      `${BASE_URL}/api/v1/auth/2fa/verify`,
      { token, secret },
      {
        withCredentials: true
      }
    );
  }

  async disable2FA(token: string): Promise<void> {
    await axiosInstance.post(
      `${BASE_URL}/api/v1/auth/2fa/disable`,
      { token },
      {
        withCredentials: true
      }
    );
  }

  async completeTwoFactorLogin(
    tempToken: string,
    twoFactorCode: string
  ): Promise<string> {
    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/2fa/validate`,
      {
        tempToken,
        token: twoFactorCode
      },
      {
        withCredentials: true
      }
    );

    return response.data.data.accessToken;
  }
}

export const authService = new AuthService();
