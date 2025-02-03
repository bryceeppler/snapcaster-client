import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionTitle from './section-title';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, PlayIcon } from '@radix-ui/react-icons';

const Buylists = ({ variant, onSignup }: { variant: 'dark' | 'light', onSignup: () => void }) => {
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
               {/*Video placeholder  */}
               <div className="relative w-full h-[500px] bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayIcon className="w-16 h-16 text-gray-500" />
                </div>
               </div>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" className="bg-[#f8c14a] text-white gap-3 hover:bg-[#f8c14a]/90" onClick={onSignup}>Get Started <ArrowRightIcon className="w-4 h-4" /></Button>
        </div>
      </div>
    </section>
  );
};

export default Buylists;
