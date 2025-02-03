import { VideoPlayer } from '@/components/ui/video-player';
import SectionTitle from './section-title';

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
                <VideoPlayer
                  videoUrl="https://cdn.snapcaster.ca/videos/video-test.mp4"
                  thumbnailUrl="https://placehold.co/1280x720"
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
