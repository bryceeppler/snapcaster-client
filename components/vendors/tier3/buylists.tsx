import { ArrowRightIcon } from '@radix-ui/react-icons';

import SectionTitle from './section-title';

import { Button } from '@/components/ui/button';
import { LoomPlayer } from '@/components/ui/loom-player';

const Buylists = ({
  variant,
  onSignup
}: {
  variant: 'dark' | 'light';
  onSignup: () => void;
}) => {
  return (
    <section
      className={`bg-primary py-20 ${
        variant === 'dark' ? 'text-white' : 'text-primary'
      }`}
      id="buylist-integration"
    >
      <div className="container">
        <SectionTitle
          subtitle="BUYLISTS"
          title="Build your inventory with our Buylist feature"
          paragraph="Users can browse and submit BinderPOS buylists to your website directly from Snapcaster. Eliminate the bottleneck of limited inventory!"
          variant={variant}
        />

        <div className="mx-auto mt-16 max-w-4xl">
          <LoomPlayer
            videoId="a7b2d758c3e048c7a80b6a421ab5f190"
            title="Snapcaster Buylists"
          />
        </div>

        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="gap-3 bg-[#f8c14a] text-white hover:bg-[#f8c14a]/90"
            onClick={onSignup}
          >
            Get Started <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Buylists;
