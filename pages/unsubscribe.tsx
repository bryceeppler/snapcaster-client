import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function Unsubscribe() {
  const router = useRouter();
  const [status, setStatus] = useState<
    'loading' | 'success' | 'error' | 'no_email'
  >('loading');
  const [message, setMessage] = useState(
    'Processing your unsubscribe request...'
  );

  useEffect(() => {
    if (!router.isReady) return;

    if (!router.query.email) {
      setStatus('no_email');
      setMessage(
        'No email address provided. Please check your unsubscribe link.'
      );
      return;
    }

    const unsubscribeUser = async (email: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/email/${email}/unsubscribe`,
          {
            method: 'GET'
          }
        );

        if (!response.ok) {
          throw new Error('Failed to unsubscribe');
        }

        setStatus('success');
        setMessage(
          'You have been successfully unsubscribed from our newsletter.'
        );
      } catch {
        setStatus('error');
        setMessage(
          'Sorry, there was an error processing your unsubscribe request. Please try again later.'
        );
      }
    };

    unsubscribeUser(router.query.email as string);
  }, [router.isReady, router.query.email]);

  return (
    <div className="flex h-screen w-full flex-col items-center space-y-8 px-4 text-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold">
            Newsletter Unsubscribe
          </h2>
          <p
            className={`mt-2 text-sm ${
              status === 'error' || status === 'no_email'
                ? 'text-red-600'
                : status === 'success'
                ? 'text-green-600'
                : 'text-gray-600'
            }`}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
