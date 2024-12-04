import { cn } from '@/lib/utils';
import Marquee from '@/components/ui/marquee';

function generateGradient(seed: string) {
  const hash = seed.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  
  const hue1 = hash % 360;
  const hue2 = (hash * 7) % 360;
  
  return `linear-gradient(45deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 60%))`;
}

const reviews = [
  {
    name: 'Quirky-Signature4883',
    body: "For any Canadian who hasn't used this, I highly recommend it. Been using it for awhile and all of the improvements made to the platform have made it even better. I've got this site bookmarked and will continue using it for the foreseeable future.",
  },
  {
    name: 'DyneInferno',
    body: "I've been using this website for the past year. It has saved me SO much $$$.",
  },
  {
    name: 'xDictate',
    body: 'Been using this for a few months now - helped me discover a few cool stores and also helped me put together a buncha pauper decks - thanks OP, this is seriously a huge service for the Canadian mtg community and I tell whoever I can about it!',
  },
  {
    name: 'SoloWing',
    body: 'Yo, I love you guys so much for this.',
  },
  {
    name: 'iwumbo2',
    body: `Helped me find occasional singles I couldn't find at my usual stores, and sometimes for cheaper too. Gonna continue using this whenever I can't find what I want at my usual stores, or if I feel the prices are too high.`,
  },
  {
    name: 'chp129',
    body: 'Just bought some cards using your site. It was awesome to use.',
  },
  {
    name: 'Ghnuberath',
    body: "This site is very well done. I've used it a bunch. Great work!",
  },
  {
    name: 'DDohD',
    body: "I don’t know who made this website but your doing gods work! It’s been a game changer. I use to manually go through ever Canadian store when purchasing high end foils. The amount of time I’ve saved is awesome. Really appreciate all you do! I recommend you to all player who shop at our LGS.",
  }
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  name,
  body
}: {
  name: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
        // light styles
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        // dark styles
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div 
          className="w-8 h-8 rounded-full"
          style={{ background: generateGradient(name) }}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
        </div>
      </div>
      <blockquote className="mt-2 text-sm line-clamp-6 text-left overflow-ellipsis">{body}</blockquote>
    </figure>
  );
};

export default function Testimonials() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <Marquee pauseOnHover className="[--duration:20s]">
        {/* use index for key */}
        {firstRow.map((review, i) => (
          <ReviewCard key={i} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review, i) => (
          <ReviewCard key={i} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
