'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVendors } from '@/hooks/queries/useVendors';
import { usePathname, useSearchParams } from 'next/navigation';

export default function VendorsSection() {
  const { vendors } = useVendors();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle hash navigation for #vendors
    // This will work in both the Pages Router and App Router
    if (typeof window !== 'undefined') {
      // Check if we have a hash in the URL
      const hash = window.location.hash;
      if (hash === '#vendors') {
        const element = document.getElementById('vendors');
        if (element) {
          // Use a small delay to ensure the DOM is fully rendered
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }
  }, [pathname, searchParams]);

  return (
    <div id="vendors" className="scroll-mt-32 space-y-8">
      <div className="space-y-4 text-center">
        <h3 className="text-3xl font-bold">
          We support {vendors.length} stores across Canada!
        </h3>
        <p className="mx-auto max-w-3xl leading-relaxed text-muted-foreground">
          If you're a Local Game Store (LGS) owner and wish to feature your
          website on Snapcaster, we invite you to join our official Discord
          server and send us a direct message or send us an email at{' '}
          <a
            href="mailto:info@snapcaster.gg"
            className="text-primary transition-colors hover:text-primary/80"
          >
            info@snapcaster.gg
          </a>
          . This is an excellent chance to promote your store's special offers,
          discount codes, and events.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <motion.a
            key={vendor.slug}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            target="_blank"
            href={vendor.url}
            className="rounded-xl border bg-popover p-4 text-center shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-accent/50 hover:shadow-md"
          >
            {vendor.name}
          </motion.a>
        ))}
      </div>
    </div>
  );
}
