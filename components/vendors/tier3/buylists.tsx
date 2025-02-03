import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionTitle from './section-title';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from '@radix-ui/react-icons';

const Buylists = ({ variant }: { variant: 'dark' | 'light' }) => {
  return (
    <section
      className={`bg-primary py-20 ${
        variant === 'dark' ? 'text-white' : 'text-primary'
      }`}
      id="buylist-integration"
    >
      {' '}
      <div className="container">
        <SectionTitle
          subtitle="BUYLISTS"
          title="Be featured on our buylists feature"
          paragraph="Users can browse and submit BinderPOS buylists to your website directly from Snapcaster. Eliminate the bottleneck of limited inventory!"
          variant={variant}
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
        <div className="mt-12 text-center">
          <Button size="lg" className="bg-[#f8c14a] text-white gap-3 hover:bg-[#f8c14a]/90">Get Started <ArrowRightIcon className="w-4 h-4" /></Button>
        </div>
      </div>
    </section>
  );
};

export default Buylists;
