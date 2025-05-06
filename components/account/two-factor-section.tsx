'use client';

import { useState } from 'react';
import { QrCode, Shield, Copy, CheckCircle, XCircle } from 'lucide-react';
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
import axiosInstance from '@/utils/axiosWrapper';

type TwoFactorSetupData = {
  secret: string;
  qrCode: string;
  backupCodes: string[];
};

export function TwoFactorSection() {
  const { toast } = useToast();
  const {
    profile,
    setup2FA,
    isSettingUp2FA,
    verify2FA,
    isVerifying2FA,
    disable2FA,
    isDisabling2FA
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [setupData, setSetupData] = useState<TwoFactorSetupData | null>(null);
  const [setupStep, setSetupStep] = useState<'initial' | 'setup' | 'verify'>(
    'initial'
  );
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);

  const is2faEnabled = profile?.data?.user?.twoFactorEnabled || false;

  const initiate2FASetup = async () => {
    setup2FA(undefined, {
      onSuccess: (data) => {
        setSetupData(data);
        setSetupStep('setup');
      }
    });
  };

  const verifyTwoFactor = async () => {
    if (!verificationCode || !setupData) return;

    verify2FA(
      { token: verificationCode, secret: setupData.secret },
      {
        onSuccess: () => {
          // Reset the setup state
          setSetupStep('initial');
          setSetupData(null);
          setVerificationCode('');
        }
      }
    );
  };

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

  const disableTwoFactor = async (verificationCode: string) => {
    disable2FA(verificationCode, {
      onSuccess: () => {
        // Handle success
      }
    });
  };

  const renderInitialState = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">Two-Factor Authentication</h3>
          <p className="text-sm text-muted-foreground">
            {is2faEnabled
              ? 'Your account is protected with two-factor authentication.'
              : 'Add an extra layer of security to your account with two-factor authentication.'}
          </p>
        </div>
        {!is2faEnabled && (
          <Button
            variant="outline"
            size="sm"
            onClick={initiate2FASetup}
            disabled={isLoading}
          >
            {isLoading ? 'Setting up...' : 'Enable 2FA'}
          </Button>
        )}
      </div>
    </div>
  );

  const renderSetupState = () => {
    if (!setupData) return null;

    return (
      <div className="space-y-6">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-medium">Scan QR Code</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Scan this QR code with your authenticator app (Google Authenticator,
            Authy, etc.).
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

          <h3 className="mb-2 font-medium">Manual Setup</h3>
          <p className="mb-2 text-sm text-muted-foreground">
            If you can't scan the QR code, enter this code manually in your app:
          </p>
          <div className="mb-4 rounded bg-muted p-2 text-center font-mono">
            {setupData.secret}
          </div>

          <h3 className="mb-2 font-medium">Backup Codes</h3>
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

            <Button
              variant="default"
              size="sm"
              onClick={() => setSetupStep('verify')}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderVerifyState = () => (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-medium">Verify Setup</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Enter the verification code from your authenticator app to complete
          the setup.
        </p>

        <div className="mb-4 space-y-2">
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
            onClick={() => setSetupStep('setup')}
          >
            Back
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={verifyTwoFactor}
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Verify & Enable'}
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
        {setupStep === 'setup' && renderSetupState()}
        {setupStep === 'verify' && renderVerifyState()}
      </CardContent>
    </Card>
  );
}
