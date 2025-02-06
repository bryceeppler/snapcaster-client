import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionTitle from './section-title';
import Link from 'next/link';
import {
  ArrowRightIcon,
  ArrowDownIcon
} from 'lucide-react';
import SingleCatalogItem from '@/components/vendors/single-catalog-item';
import { ShineBorder } from '@/components/ui/shine-border';

const Visibility = () => {
  return (
    <section className="bg-white py-20 " id="brand-visibility">
      <div className="container">
        <SectionTitle
          subtitle="DOMINATE THE MARKETPLACE"
          title="Stand Out From The Competition"
          paragraph="Capture more sales with premium visibility features that make your store impossible to miss. Our partners report up to 29% higher click-through rates with these premium branding elements."
        />

        <div className="grid lg:grid-cols-2 gap-16 mt-12  mx-auto">
          <div className="">
            <div className="flex flex-col gap-4 justify-center h-full">
            <Card className="p-4 shadow-lg">
                <CardHeader><CardTitle>Premium Brand Presence</CardTitle></CardHeader>
                <CardContent>
                    Instantly build trust and recognition with your professional store logo displayed prominently on every listing. Partners report <span className="font-bold">35% higher conversion rates</span>  with branded results.
                </CardContent>
            </Card>
            <Card className="p-4 shadow-lg">
                <CardHeader><CardTitle>Smart Price Display</CardTitle></CardHeader>
                <CardContent>
                    Convert price-conscious buyers instantly by showing your competitive discounted prices right in the search results. Customers are more likely to click when they see savings upfront.
                </CardContent>
            </Card>
            <Card className="p-4 shadow-lg">
                <CardHeader><CardTitle>Strategic Promo Visibility</CardTitle></CardHeader>
                <CardContent>
                    Drive urgency and action by displaying your promo codes directly in search results. Partners using this feature see a significant increase in repeat customers.
                </CardContent>
            </Card>
            <Card className="p-4 shadow-lg">
                <CardHeader><CardTitle>Featured Partner Status</CardTitle></CardHeader>
                <CardContent>
                    Gain instant credibility as a featured partner on our <Link className="text-blue-500 underline" href="/about">About page</Link>. Join an exclusive group of verified vendors that customers trust first.
                </CardContent>
            </Card>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <div className="max-w-[320px] w-full p-4 shadow-lg border rounded-lg mx-auto">
            
            <SingleCatalogItem
              product={{
                name: 'Phelia, Exuberant Shepherd',
                set: 'Modern Horizons 3',
                price: 6.50,
                condition: 'NM',
                finish: 'foil',
                vendor: 'Your Store Name',
                link: '',
                image:
                  'https://cdn.snapcaster.ca/images/mh3-40-phelia-exuberant-shepherd.png',
                variant_id: '123'
              }}
              storeLogo={false}
            />
          </div>
          <ArrowRightIcon className="w-12 h-12 hidden md:block" />
          <ArrowDownIcon className="w-12 h-12 block md:hidden" />
            <ShineBorder borderWidth={2} className="max-w-[320px] w-full h-fit p-4 shadow-lg rounded-lg mx-auto" color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
            <SingleCatalogItem
              product={{
                name: 'Phelia, Exuberant Shepherd',
                set: 'Modern Horizons 3',
                price: 6.50,
                discounted_price: 5.85,
                discount_code: 'SNAPCASTER10',
                condition: 'NM',
                finish: 'foil',
                vendor: 'Your Store Name',
                link: '',
                image:
                  'https://cdn.snapcaster.ca/images/mh3-40-phelia-exuberant-shepherd.png',
                variant_id: '123'
              }}
              storeLogo={true}
            />
            </ShineBorder>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Visibility;
