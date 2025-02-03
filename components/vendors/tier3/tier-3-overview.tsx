import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SectionTitle from "./section-title";
import { 
  BarChart3, 
  Image, 
  ClipboardList, 
  Mail, 
  Tag, 
  Percent, 
  MessageCircle,
  ShoppingCart,
  LucideIcon,
  ArrowRightIcon
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Tier3OverviewProps {
  onSignup?: () => void;
}

const Tier3Overview = ({ onSignup }: Tier3OverviewProps) => {
    const features = [
        {
            title: "Analytics Dashboard",
            description: "Gain an unfair advantage with exclusive access to comprehensive market insights, pricing trends, and buyer behavior data across Canada's TCG market. Make data-driven decisions that boost your profits.",
            icon: BarChart3,
            id: "analytics"
        },
        {
            title: "Brand Visibility",
            description: "Stand out from the competition with prominent store logo placement in search results. Catch buyers' attention first and drive more traffic to your listings.",
            icon: Image,
            id: "brand-visibility"
        },
        {
            title: "Buylist Integration",
            description: "Access high-margin buying opportunities first through our exclusive buylist system. Turn inventory faster and maximize your ROI on every purchase.",
            icon: ClipboardList,
            id: "buylist-integration"
        },
        {
            title: "1-Click Checkout",
            description: "Convert more sales with our friction-free multisearch checkout system. Reduce cart abandonment and increase average order value instantly.",
            icon: ShoppingCart,
            id: "1-click-checkout"
        },
        {
            title: "Newsletter Promotion",
            description: "Get your store promoted directly to thousands of active buyers through our high-engagement newsletter. Drive immediate sales with targeted exposure.",
            icon: Mail,
            id: "other-features"
        },
        {
            title: "Discount Promotions",
            description: "Showcase your promotions site-wide to drive massive traffic during sales events. Turn slow inventory into quick cash with targeted promotional tools.",
            icon: Percent,
            id: "brand-visibility"
        },

    ]
  return (
    <section className="py-20 bg-white" id="overview">
      <div className="container">
        <SectionTitle
          subtitle="PARTNER BENEFITS"
          title="Accelerate Your Growth with Tier 3 Access"
          paragraph="Join an exclusive group of top-performing stores who leverage these powerful tools to dominate the Canadian TCG market. Limited spots available - upgrade now to lock in these advantages."
        />

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-12">
          {
            features.map((feature, index) => (
              <Feature key={index} {...feature} />
            ))
          }
        </div>

        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="bg-[#f8c14a] text-white gap-3 hover:bg-[#f8c14a]/90"
            onClick={onSignup}
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    </section>
  );
};

const Feature = ({
    title,
    description,
    icon: Icon,
    id
  }: {
    title: string;
    description: string;
    icon: LucideIcon;
    id: string;
  }) => {
    return (
      <Card>
        <CardHeader className="flex flex-row gap-4 items-center">
          <Icon className="h-8 w-8 text-primary" />
          <CardTitle className="text-left">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href={`#${id}`} className="text-primary flex items-center gap-2">Learn More <ArrowRightIcon className="h-4 w-4 text-primary" /></Link>
        </CardContent>
      </Card>
    );
  };
export default Tier3Overview;
