import { CheckCircle, Circle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  href?: string;
}

export function OnboardingProgress() {
  const steps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Complete Profile',
      description: 'Add your business information and contact details',
      completed: true,
      required: true
    },
    {
      id: 'payment',
      title: 'Setup Payment',
      description: 'Connect to Stripe for payouts',
      completed: false,
      required: true
    },
    {
      id: 'inventory',
      title: 'Add Inventory',
      description: 'Upload your first products to start selling',
      completed: false,
      required: false
    },
    {
      id: 'shipping',
      title: 'Configure Shipping',
      description: 'Set up shipping rates and policies',
      completed: false,
      required: false
    }
  ];
  const completedSteps = steps.filter((step) => step.completed).length;
  const totalSteps = steps.length;
  const progress = (completedSteps / totalSteps) * 100;
  const isComplete = completedSteps === totalSteps;

  // Only show if not all steps are completed
  if (isComplete) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="">Setup Your Account</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {completedSteps} of {totalSteps}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Complete these steps to start selling on the marketplace.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-right text-xs font-medium">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="group flex items-center space-x-3">
              <div className="flex-shrink-0">
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 transition-colors group-hover:text-blue-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h4
                    className={`text-sm font-medium ${
                      step.completed
                        ? 'text-gray-900 line-through'
                        : 'text-gray-900'
                    }`}
                  >
                    {step.title}
                  </h4>
                </div>
                <p
                  className={`text-xs ${
                    step.completed ? 'text-gray-500' : 'text-gray-600'
                  }`}
                >
                  {step.description}
                </p>
              </div>
              {!step.completed && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-blue-200 text-xs text-blue-700 hover:bg-blue-50"
                >
                  Complete
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
