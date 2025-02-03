import SectionTitle from "./section-title";

import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";

const Multisearch = () => {

  return (
    <section className="bg-white py-20 " id="1-click-checkout">
      <div className="container">
        <SectionTitle
          subtitle="EASY CHECKOUT"
          title="1-Click Checkout"
          paragraph="Convert more sales with our friction-free multisearch checkout system. Reduce cart abandonment and increase average order value instantly."
        />
        <div>
          <div className="mx-auto mt-16 pb-4 md:pb-0 lg:px-8">
            <div className="relative">
              <HeroVideoDialog
                className="max-w-[900px]dark:hidden mx-auto block"
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                thumbnailAlt="Hero Video"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Multisearch;
