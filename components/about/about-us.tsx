import React from 'react';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function AboutUs() {
  return (
    <section>
      <div className="mb-10 flex items-center justify-center">
        <Separator className="mr-4 w-12" />
        <h2 className="text-center text-3xl font-bold">About Us</h2>
        <Separator className="ml-4 w-12" />
      </div>
      <Card className="mx-auto border border-primary/10 p-8 shadow-sm">
        <div className="space-y-6 text-lg">
          <p>
            Snapcaster was created in 2022 with support for only 5 stores to
            help us find Magic: the Gathering cards in Canada.
          </p>
          <p>
            We were tired of ordering cards from the US, paying duties and
            waiting for long shipping times. So we decided to build a tool that
            would help us find the card we wanted, right here in Canada. We have
            received great feedback from the community to build the best tool
            possible, it wouldn't be possible without you.
          </p>
          <p>
            Our mission is to{' '}
            <span className="font-bold">help you find the cards you need</span>,{' '}
            <span className="font-bold">save you time</span>, and{' '}
            <span className="font-bold">support local game stores</span> in
            Canada.
          </p>
          <p className="font-medium text-primary">
            We're proud to be supported by our sponsors who share our vision and
            help make our work possible.
          </p>
        </div>
      </Card>
    </section>
  );
}
