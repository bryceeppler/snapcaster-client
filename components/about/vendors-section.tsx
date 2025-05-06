'use client';

import { useVendors } from '@/hooks/queries/useVendors';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

export default function VendorsSection() {
  const { vendors } = useVendors();

  return (
    <section>
      <div className="mb-10 flex items-center justify-center">
        <Separator className="mr-4 w-12" />
        <h2 className="text-center text-3xl font-bold">Supported Vendors</h2>
        <Separator className="ml-4 w-12" />
      </div>

      <div className="mb-8 text-center">
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          We proudly support{' '}
          <span className="font-medium text-primary">{vendors.length}</span>{' '}
          vendors across Canada, helping TCG players connect with local game
          stores.
        </p>
      </div>

      <Card className="overflow-hidden p-8">
        <ul className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {vendors.map((vendor, index) => (
            <li
              key={index}
              className="rounded-md px-4 py-3 text-center font-medium transition-colors hover:bg-primary/5"
            >
              {vendor.name}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
