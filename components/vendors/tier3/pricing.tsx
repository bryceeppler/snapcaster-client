import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

interface PricingProps {
  variant: 'dark' | 'light';
  onSignup?: (plan: "monthly" | "quarterly") => void;
}

const Pricing = ({ variant, onSignup }: PricingProps) => {
  return (
    <section
      className={`py-20 ${
        variant === 'dark' ? 'text-white bg-primary' : 'text-primary bg-white'
      }`}
    >
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg opacity-80">Choose the plan that works best for your business. All plans include full access to our platform features.</p>
        </div>

        <div className='mt-12 flex flex-col gap-8 md:flex-row w-full justify-center max-w-5xl mx-auto'>
          <Card className="flex-1 border border-border/40 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
            <CardHeader className="space-y-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">Monthly Plan</CardTitle>
                <CardDescription>Perfect for trying out our platform</CardDescription>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$350</span>
                <span className="text-sm opacity-80">/month</span>
              </div>
              <p className="text-sm opacity-70">1 month fixed term. Cancel anytime.</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm opacity-90">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" onClick={() => onSignup?.("monthly")}>Get Started</Button>
            </CardFooter>
          </Card>

          <Card className="flex-1 border-2 border-primary bg-background/50 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-sm font-medium rounded-bl-lg text-white">
              Popular
            </div>
            <CardHeader className="space-y-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">Quarterly Plan</CardTitle>
                <CardDescription>Save 17% with quarterly billing</CardDescription>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$300</span>
                <span className="text-sm opacity-80">/month</span>
              </div>
              <p className="text-sm opacity-70">3 month fixed term</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm opacity-90">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => onSignup?.("quarterly")}>Get Started</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

const features = [
  "Analytics Dashboard: Track performance metrics and customer behavior",
  "Boost sales with customizable promotion codes",
  "1-Click Checkout",
  "Logo placement in 100% of search results",
  "Build trust as a verified vendor on our About page",
  "Newsletter Promotion: Reach 1100+ engaged buyers monthly",
  "VIP Discord Integration: Direct access to our most active buying community",
  "Pro Rewards Program ($89/mo value): 30 premium discount codes to drive customer loyalty"
];

export default Pricing;
