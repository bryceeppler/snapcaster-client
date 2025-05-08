import SectionTitle from './section-title';

import { LoomPlayer } from '@/components/ui/loom-player';

const Multisearch = () => {
  return (
    <section className="bg-white py-20 " id="1-click-checkout">
      <div className="container">
        <SectionTitle
          subtitle="EASY CHECKOUT"
          title="Convert more sales with our friction-free checkout system."
          paragraph="Convert more sales with our friction-free multisearch checkout system. Reduce cart abandonment and increase average order value instantly."
        />
        <div>
          <div className="mx-auto mt-16 pb-4 md:pb-0 lg:px-8">
            <div className="relative">
              <div className="mx-auto mt-16 max-w-4xl">
                <LoomPlayer
                  videoId="52617a394f064a85911791c30267582c"
                  title="Snapcaster Multisearch"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Multisearch;
