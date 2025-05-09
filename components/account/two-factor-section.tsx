'use client';

import {
  AlertCircle,
  CheckCircle,
  Copy,
  Mail,
  Shield,
  Smartphone
} from 'lucide-react';
import { useCallback, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

type TwoFactorSetupData = {
  secret: string;
  qrCode: string;
  backupCodes: string[];
};

type TwoFactorMethod = 'app' | 'email' | 'recovery';

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
    disableApp2FA,
    isDisablingApp2FA,
    disableEmail2FA,
    isDisablingEmail2FA,
    generateDisable2FACode,
    resendVerificationEmail,
    isResendingVerification
  } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [setupData, setSetupData] = useState<TwoFactorSetupData | null>(null);
  const [setupStep, setSetupStep] = useState<'initial' | 'app-setup'>(
    'initial'
  );
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [disableVerificationCode, setDisableVerificationCode] = useState('');
  const [methodToDisable, setMethodToDisable] =
    useState<TwoFactorMethod | null>(null);
  const [isGeneratingEmailCode, setIsGeneratingEmailCode] = useState(false);

  const user = profile?.data?.user;
  const is2faEnabled = user?.twoFactorMethods?.length || false;
  const isApp2FAEnabled = user?.twoFactorMethods?.includes('app') || false;
  const isEmail2FAEnabled = user?.twoFactorMethods?.includes('email') || false;
  const isEmailVerified = user?.emailVerified || false;

  // Setup app-based 2FA - we need to use a custom mutation to handle the setup data
  const setupAppAuth = useCallback(async () => {
    setupApp2FA(undefined, {
      onSuccess: (data) => {
        setSetupData(data);
        setSetupStep('app-setup');
        setVerificationCode('');
        toast({
          title: '2FA Setup Initiated',
          description: 'Please scan the QR code with your authenticator app.'
        });
      },
      onError: () => {
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
    setupEmail2FA(undefined, {
      onSuccess: () => {
        toast({
          title: 'Email 2FA Enabled',
          description: 'Email 2FA has been enabled.'
        });
      },
      onError: () => {
        toast({
          title: 'Setup Failed',
          description: 'There was an error setting up 2FA. Please try again.',
          variant: 'destructive'
        });
      }
    });
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

  // Handle opening the disable 2FA dialog
  const handleOpenDisableDialog = (method: TwoFactorMethod) => {
    setMethodToDisable(method);
    setDisableVerificationCode('');
    setDisableDialogOpen(true);

    // For email method, we need to generate a verification code first
    if (method === 'email') {
      setIsGeneratingEmailCode(true);
      generateDisable2FACode('email', {
        onSuccess: () => {
          toast({
            title: 'Verification Code Sent',
            description:
              'A verification code has been sent to your email address.'
          });
          setIsGeneratingEmailCode(false);
        },
        onError: () => {
          toast({
            title: 'Failed to Send Code',
            description:
              'There was an error sending the verification code. Please try again.',
            variant: 'destructive'
          });
          setIsGeneratingEmailCode(false);
        }
      });

      // Set a timer to reset the loading state after 2 seconds if API doesn't respond
      setTimeout(() => {
        setIsGeneratingEmailCode(false);
      }, 2000);
    }
  };

  // Handle disabling 2FA based on the selected method
  const handleDisable2FA = () => {
    if (!disableVerificationCode || !methodToDisable) {
      toast({
        title: 'Verification Code Required',
        description: 'Please enter a valid verification code.',
        variant: 'destructive'
      });
      return;
    }

    if (methodToDisable === 'app') {
      disableApp2FA(disableVerificationCode, {
        onSuccess: () => {
          toast({
            title: 'App 2FA Disabled',
            description: 'App 2FA has been disabled.'
          });
        },
        onError: () => {
          toast({
            title: 'Disable Failed',
            description:
              'There was an error disabling 2FA. Please refresh the page and try again.',
            variant: 'destructive'
          });
        }
      });
    } else if (methodToDisable === 'email') {
      disableEmail2FA(disableVerificationCode, {
        onSuccess: () => {
          toast({
            title: 'Email 2FA Disabled',
            description: 'Email 2FA has been disabled.'
          });
        },
        onError: () => {
          toast({
            title: 'Disable Failed',
            description:
              'There was an error disabling 2FA. Please refresh the page and try again.',
            variant: 'destructive'
          });
        }
      });
    }

    // Close the dialog
    setDisableDialogOpen(false);
    setDisableVerificationCode('');
    setMethodToDisable(null);
  };

  const handleResendVerification = () => {
    resendVerificationEmail(undefined, {
      onSuccess: () => {
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your inbox for the verification link.'
        });
      },
      onError: (error) => {
        toast({
          title: 'Error sending verification email',
          description: error.message
        });
      }
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

      {!is2faEnabled && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>2FA Not Enabled</AlertTitle>
          <AlertDescription>
            Please enable two-factor authentication to secure your account.
          </AlertDescription>
        </Alert>
      )}

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
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Enabled</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenDisableDialog('app')}
              disabled={isDisablingApp2FA}
            >
              {isDisablingApp2FA ? 'Disabling...' : 'Disable'}
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
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Enabled</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenDisableDialog('email')}
              disabled={isDisablingEmail2FA}
            >
              {isDisablingEmail2FA ? 'Disabling...' : 'Disable'}
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
              <div className="relative mb-4 rounded bg-muted p-2 text-center font-mono">
                {setupData.secret}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
                  onClick={() => {
                    navigator.clipboard.writeText(setupData.secret);
                    toast({
                      title: 'Secret Copied',
                      description: 'Secret code copied to clipboard.'
                    });
                  }}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy secret code</span>
                </Button>
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

            <div>
              <h4 className="mb-2 font-medium">4. Verify Setup</h4>
              <p className="mb-4 text-sm text-muted-foreground">
                Enter the verification code from your authenticator app to
                complete the setup.
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
                  }}
                >
                  Cancel
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
        </div>
      </div>
    );
  };

  return (
    <>
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
        </CardContent>
      </Card>

      {/* Disable 2FA Dialog */}
      <Dialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Disable {methodToDisable === 'app' ? 'App' : 'Email'} 2FA
            </DialogTitle>
            <DialogDescription>
              {methodToDisable === 'app'
                ? 'Enter the verification code from your authenticator app to disable 2FA.'
                : 'Enter the verification code sent to your email to disable email 2FA.'}
              {methodToDisable === 'app' &&
                user?.twoFactorMethods?.length === 1 && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      This is your only active 2FA method. Disabling it will
                      remove all two-factor authentication protection from your
                      account.
                    </AlertDescription>
                  </Alert>
                )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="disableVerificationCode">Verification Code</Label>
              <Input
                id="disableVerificationCode"
                value={disableVerificationCode}
                onChange={(e) => setDisableVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                disabled={isGeneratingEmailCode}
              />
              {methodToDisable === 'email' && isGeneratingEmailCode && (
                <p className="text-sm text-muted-foreground">
                  Sending verification code to your email...
                </p>
              )}
              {methodToDisable === 'email' && !isGeneratingEmailCode && (
                <p className="text-sm text-muted-foreground">
                  A verification code has been sent to your email address.
                </p>
              )}
              {methodToDisable === 'app' && (
                <p className="text-sm text-muted-foreground">
                  Enter the code from your authenticator app or use a backup
                  code.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDisableDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisable2FA}
              disabled={
                disableVerificationCode.length !== 6 ||
                isDisablingApp2FA ||
                isDisablingEmail2FA ||
                isGeneratingEmailCode
              }
            >
              {isDisablingApp2FA || isDisablingEmail2FA
                ? 'Disabling...'
                : 'Disable 2FA'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
