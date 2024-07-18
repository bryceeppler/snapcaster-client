import React from 'react';
import SignInCard from './signin';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Card, CardContent, CardHeader } from './ui/card';
type Props = {
  message: string;
};

const LoginRequired = ({ message }: Props) => {
  return (
    <Card className={`mx-auto w-full max-w-sm`}>
      <CardHeader className="flex flex-row items-center gap-2">
        <ExclamationTriangleIcon className="h-5 w-5 text-primary" />
        <p className="text-left text-sm text-muted-foreground">{message}</p>
      </CardHeader>
      <CardContent>
        <SignInCard noborder={true} />
      </CardContent>
    </Card>
  );
};

export default LoginRequired;
