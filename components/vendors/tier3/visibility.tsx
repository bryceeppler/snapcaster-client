import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionTitle from './section-title';
import Link from 'next/link';
import {
  BarChart3,
  Image,
  ClipboardList,
  Mail,
  Tag,
  Percent,
  MessageCircle,
  ShoppingCart,
  ArrowRightIcon,
  ArrowDownIcon
} from 'lucide-react';
import SingleCatalogItem from '@/components/vendors/single-catalog-item';

const Visibility = () => {
  return (
    <section className="bg-white py-20 " id="brand-visibility">
      <div className="container">
        <SectionTitle
          subtitle="VISIBILITY"
          title="Brand Awareness"
          paragraph="Stand out in the search results with your brand name and logo."
        />

        <div className="grid lg:grid-cols-2 gap-16 mt-12  mx-auto">
          <div className="">
            <div className="flex flex-col gap-4 justify-center h-full">
            <Card className="p-4 shadow-lg">
                <CardHeader><CardTitle>Store Logo</CardTitle></CardHeader>
                <CardContent>
                    Display your brand name and logo on each search result.
                </CardContent>
            </Card>
            <Card className="p-4 shadow-lg">
                <CardHeader><CardTitle>Discount Badge</CardTitle></CardHeader>
                <CardContent>
                    When a discount code is applied, display the adjusted price in all search results for your products.
                </CardContent>
            </Card>
            <Card className="p-4 shadow-lg">
                <CardHeader><CardTitle>Promo Codes</CardTitle></CardHeader>
                <CardContent>
                    Display the promo code on each search result.
                  </CardContent>
                </Card>
                <Card className="p-4 shadow-lg">
                    <CardHeader><CardTitle>Supported Stores Page</CardTitle></CardHeader>
                    <CardContent>
                        Appear as a sponsor on our <Link className="text-blue-500 underline" href="/about">About page</Link>.
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
          <div className="max-w-[320px] w-full h-fit p-4 shadow-lg border rounded-lg mx-auto">
            
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
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Visibility;
