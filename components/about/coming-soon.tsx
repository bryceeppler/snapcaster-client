import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export default function ComingSoon() {
  return (
    <section>
      <div className="mb-10 flex items-center justify-center">
        <Separator className="mr-4 w-12" />
        <h2 className="text-center text-3xl font-bold">Coming Soon</h2>
        <Separator className="ml-4 w-12" />
      </div>
      <Card className="overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 shadow-md">
        <div className="flex flex-col gap-8 p-8 md:flex-row md:items-center">
          <div className="flex w-full justify-center md:w-1/3">
            <div className="overflow-hidden rounded-lg bg-zinc-600 p-6 shadow-md transition-transform hover:scale-[1.02] dark:bg-muted">
              <Image
                src="https://imagedelivery.net/kwpOMlVOHoYYK5BfnMRBqg/ff0cfeac-4e3a-494c-e6fb-4b671b2f3200/public"
                alt="Snapcaster Marketplace logo"
                width={320}
                height={160}
                className="object-contain"
              />
            </div>
          </div>
          <div className="w-full space-y-5 md:w-2/3">
            <h3 className="text-center text-2xl font-bold md:text-left">
              The Snapcaster Marketplace
            </h3>
            <p className="text-lg">
              We're excited to announce our upcoming marketplace platform where
              our community can shop directly on Snapcaster. The Snapcaster
              Marketplace will be launching soon, connecting vendors and TCG
              players across Canada.
            </p>
            <p className="text-sm text-muted-foreground">
              We will be launching the marketplace in the next few months, stay
              tuned for more updates.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
