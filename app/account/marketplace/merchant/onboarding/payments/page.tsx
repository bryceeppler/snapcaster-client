import SetupStripeButton from '@/components/account/marketplace/merchant/onboarding/payments/setup-stripe-button';

function PaymentConnection() {
  const connectedAccountId = '123456';
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-2xl font-bold">
        Add information to start accepting money
      </h2>

      <SetupStripeButton stripeAccountId={connectedAccountId} />
    </div>
  );
}

export default PaymentConnection;
