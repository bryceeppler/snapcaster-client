import SectionTitle from './section-title';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { VideoPlayer } from '@/components/ui/video-player';

const Buylists = ({ variant, onSignup }: { variant: 'dark' | 'light'; onSignup: () => void }) => {
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
        
        <div className="max-w-4xl mx-auto mt-16">
          <VideoPlayer
            videoUrl="https://cdn.snapcaster.ca/videos/video-test.mp4"
            thumbnailUrl="https://placehold.co/1280x720"
          />
        </div>

        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="bg-[#f8c14a] text-white gap-3 hover:bg-[#f8c14a]/90"
            onClick={onSignup}
          >
            Get Started <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Buylists;

