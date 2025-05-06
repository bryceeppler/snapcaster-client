'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  QrCode,
  Shield,
  Copy,
  CheckCircle,
  XCircle,
  Mail,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type TwoFactorSetupData = {
  secret: string;
  qrCode: string;
  backupCodes: string[];
};

type TwoFactorMethod = 'app' | 'email';

// This helper safely checks if the property exists on an object
const hasProp = <T extends object, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

export function TwoFactorSection() {
  const { toast } = useToast();
  const {
    profile,
    setupApp2FA,
    isSettingUpApp2FA,
    setupEmail2FA,
    isSettingUpEmail2FA,
    verifyApp2FA,
    isVerifyingApp2FA,
    disable2FA,
    isDisabling2FA,
    resendVerificationEmail,
    isResendingVerification
  } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [setupData, setSetupData] = useState<TwoFactorSetupData | null>(null);
  const [setupStep, setSetupStep] = useState<
    'initial' | 'app-setup' | 'app-verify'
  >('initial');
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);
  const [activeMethod, setActiveMethod] = useState<TwoFactorMethod | null>(
    null
  );

  const user = profile?.data?.user;
  const is2faEnabled = user?.twoFactorEnabled || false;
  const isApp2FAEnabled = user?.twoFactorMethods?.includes('app') || false;
  const isEmail2FAEnabled = user?.twoFactorMethods?.includes('email') || false;
  const isEmailVerified = user?.emailVerified || false;

  // Setup app-based 2FA - we need to use a custom mutation to handle the setup data
  const setupAppAuth = useCallback(async () => {
    setActiveMethod('app');
    setupApp2FA(undefined, {
      onSuccess: (data) => {
        setSetupData(data);
        setSetupStep('app-setup');
        toast({
          title: '2FA Setup Initiated',
          description: 'Please scan the QR code with your authenticator app.'
        });
      },
      onError: () => {
        setActiveMethod(null);
        toast({
          title: 'Setup Failed',
          description: 'There was an error setting up 2FA. Please try again.',
          variant: 'destructive'
        });
      }
    });
  }, [setupApp2FA, toast]);

  // Setup email-based 2FA
  const setupEmailAuth = useCallback(() => {
    if (!isEmailVerified) {
      toast({
        title: 'Email Not Verified',
        description:
          'You need to verify your email address before enabling email 2FA.',
        variant: 'destructive'
      });
      return;
    }
    setupEmail2FA();
  }, [isEmailVerified, setupEmail2FA, toast]);

  // Verify app-based 2FA
  const verifyAppAuth = useCallback(() => {
    if (!verificationCode || !setupData) return;

    verifyApp2FA(
      {
        token: verificationCode,
        secret: setupData.secret,
        method: 'app'
      },
      {
        onSuccess: () => {
          // Reset the state when verification is successful
          setSetupStep('initial');
          setSetupData(null);
          setVerificationCode('');
          setActiveMethod(null);
          toast({
            title: '2FA Enabled',
            description:
              'Two-factor authentication has been successfully enabled.'
          });
        },
        onError: () => {
          // Keep the setup data and step but clear the verification code
          setVerificationCode('');
          toast({
            title: 'Verification Failed',
            description: 'Invalid verification code. Please try again.',
            variant: 'destructive'
          });
        }
      }
    );
  }, [verificationCode, verifyApp2FA, setupData, toast]);

  const copyBackupCodes = () => {
    if (!setupData) return;

    navigator.clipboard.writeText(setupData.backupCodes.join('\n'));
    setCopiedBackupCodes(true);

    toast({
      title: 'Backup Codes Copied',
      description: 'Please store these codes in a secure location.'
    });

    setTimeout(() => setCopiedBackupCodes(false), 3000);
  };

  const disableTwoFactorMethod = async (method: TwoFactorMethod) => {
    // For simplicity, we're just going to request verification code when disabling
    // In a real app, you might want to show a prompt or modal to enter the code
    const code = prompt(`Enter verification code to disable ${method} 2FA:`);
    if (!code) return;

    disable2FA(code);

    toast({
      title: `${method === 'app' ? 'App' : 'Email'} 2FA Disabled`,
      description: `Two-factor authentication using ${
        method === 'app' ? 'authenticator app' : 'email'
      } has been disabled.`
    });
  };

  const handleResendVerification = () => {
    resendVerificationEmail();

    toast({
      title: 'Verification Email Sent',
      description: 'Please check your inbox for the verification link.'
    });
  };

  const renderInitialState = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">Two-Factor Authentication</h3>
          <p className="text-sm text-muted-foreground">
            {is2faEnabled
              ? `Your account is protected with two-factor authentication.`
              : 'Add an extra layer of security to your account with two-factor authentication.'}
          </p>
        </div>
      </div>

      {/* App 2FA Section */}
      <div className="rounded-lg border p-4">
        <div className="mb-4 flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Authenticator App</h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Use an authenticator app like Google Authenticator or Authy to
          generate verification codes.
        </p>

        {isApp2FAEnabled ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Enabled</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => disableTwoFactorMethod('app')}
              disabled={isDisabling2FA}
            >
              {isDisabling2FA ? 'Disabling...' : 'Disable'}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={setupAppAuth}
            disabled={isSettingUpApp2FA}
          >
            {isSettingUpApp2FA ? 'Setting up...' : 'Enable App 2FA'}
          </Button>
        )}
      </div>

      {/* Email 2FA Section */}
      <div className="rounded-lg border p-4">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Email Authentication</h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Receive verification codes via email when logging in to your account.
        </p>

        {!isEmailVerified && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Email Not Verified</AlertTitle>
            <AlertDescription>
              You need to verify your email address before enabling email 2FA.
              <Button
                variant="link"
                className="h-auto p-0 text-primary"
                onClick={handleResendVerification}
                disabled={isResendingVerification}
              >
                {isResendingVerification
                  ? 'Sending...'
                  : 'Resend verification email'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isEmail2FAEnabled ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Enabled</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => disableTwoFactorMethod('email')}
              disabled={isDisabling2FA}
            >
              {isDisabling2FA ? 'Disabling...' : 'Disable'}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={setupEmailAuth}
            disabled={isSettingUpEmail2FA || !isEmailVerified}
          >
            {isSettingUpEmail2FA ? 'Setting up...' : 'Enable Email 2FA'}
          </Button>
        )}
      </div>
    </div>
  );

  const renderAppSetupState = () => {
    if (!setupData) return null;

    return (
      <div className="space-y-6">
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-medium">Set Up Authenticator App</h3>

          <div className="space-y-6">
            <div>
              <h4 className="mb-2 font-medium">1. Scan QR Code</h4>
              <p className="mb-4 text-sm text-muted-foreground">
                Scan this QR code with your authenticator app (Google
                Authenticator, Authy, etc.).
              </p>
              <div className="mb-4 flex justify-center">
                <div className="rounded-lg bg-white p-2">
                  <img
                    src={setupData.qrCode}
                    alt="2FA QR Code"
                    className="h-48 w-48"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-medium">2. Manual Setup (Optional)</h4>
              <p className="mb-2 text-sm text-muted-foreground">
                If you can't scan the QR code, enter this code manually in your
                app:
              </p>
              <div className="mb-4 rounded bg-muted p-2 text-center font-mono">
                {setupData.secret}
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-medium">3. Save Backup Codes</h4>
              <p className="mb-2 text-sm text-muted-foreground">
                Save these backup codes in a secure place. You can use them to
                access your account if you lose your authenticator device.
              </p>
              <div className="mb-4 rounded bg-muted p-2 font-mono">
                <div className="grid grid-cols-2 gap-2">
                  {setupData.backupCodes.map((code, index) => (
                    <div key={index} className="text-sm">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={copyBackupCodes}
                className="flex items-center gap-1"
              >
                {copiedBackupCodes ? (
                  <>
                    <CheckCircle className="h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy Backup Codes
                  </>
                )}
              </Button>

              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSetupStep('initial');
                    setSetupData(null);
                    setActiveMethod(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setSetupStep('app-verify')}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAppVerifyState = () => (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-medium">Verify Setup</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Enter the verification code from your authenticator app to complete
          the setup.
        </p>

        <div className="mb-6 space-y-2">
          <Label htmlFor="verificationCode">Verification Code</Label>
          <Input
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
          />
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSetupStep('app-setup')}
          >
            Back
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={verifyAppAuth}
            disabled={isVerifyingApp2FA || verificationCode.length !== 6}
          >
            {isVerifyingApp2FA ? 'Verifying...' : 'Verify & Enable'}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Security</CardTitle>
        <CardDescription>
          Manage your account security settings and two-factor authentication.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {setupStep === 'initial' && renderInitialState()}
        {setupStep === 'app-setup' && renderAppSetupState()}
        {setupStep === 'app-verify' && renderAppVerifyState()}
      </CardContent>
    </Card>
  );
}
