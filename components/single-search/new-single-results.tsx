import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SingleCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 100],
    rating: 0
  });
  const [sortBy, setSortBy] = useState('relevance');
  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 79.99,
      rating: 4.5,
      category: 'Electronics',
      image: '/placeholder.svg',
      promoted: true
    },
    {
      id: 2,
      name: 'Cotton T-Shirt',
      description: 'Soft and comfortable cotton t-shirt in various colors',
      price: 19.99,
      rating: 4.2,
      category: 'Clothing',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Hiking Backpack',
      description: 'Durable and spacious backpack for outdoor adventures',
      price: 59.99,
      rating: 4.7,
      category: 'Outdoor',
      image: '/placeholder.svg'
    },
    {
      id: 4,
      name: 'Mechanical Keyboard',
      description: 'Tactile and responsive mechanical keyboard for gaming',
      price: 89.99,
      rating: 4.8,
      category: 'Electronics',
      image: '/placeholder.svg',
      promoted: true
    },
    {
      id: 5,
      name: 'Denim Jeans',
      description: 'Classic and versatile denim jeans in various fits',
      price: 39.99,
      rating: 4.3,
      category: 'Clothing',
      image: '/placeholder.svg'
    },
    {
      id: 6,
      name: 'Camping Tent',
      description: 'Lightweight and weatherproof tent for outdoor camping',
      price: 99.99,
      rating: 4.6,
      category: 'Outdoor',
      image: '/placeholder.svg'
    }
  ];
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const categoryMatch =
          filters.category.length === 0 ||
          filters.category.includes(product.category);
        const priceMatch =
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1];
        const ratingMatch = product.rating >= filters.rating;
        const searchMatch = product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return categoryMatch && priceMatch && ratingMatch && searchMatch;
      })
      .sort((a, b) => {
        if (a.promoted && !b.promoted) return -1;
        if (!a.promoted && b.promoted) return 1;
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          default:
            return 0;
        }
      });
  }, [searchTerm, filters, sortBy, products]);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleFilterChange = (type, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value
    }));
  };
  const handleSortChange = (value) => {
    setSortBy(value);
  };
  return (
    <div className="grid gap-6 p-4 md:grid-cols-[240px_1fr] md:p-6">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
          <Accordion type="single" collapsible>
            <AccordionItem value="category">
              <AccordionTrigger className="text-base">
                Category
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filters.category.includes('Electronics')}
                      onCheckedChange={() =>
                        handleFilterChange(
                          'category',
                          filters.category.includes('Electronics')
                            ? filters.category.filter(
                                (c) => c !== 'Electronics'
                              )
                            : [...filters.category, 'Electronics']
                        )
                      }
                    />
                    Electronics
                  </Label>
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filters.category.includes('Clothing')}
                      onCheckedChange={() =>
                        handleFilterChange(
                          'category',
                          filters.category.includes('Clothing')
                            ? filters.category.filter((c) => c !== 'Clothing')
                            : [...filters.category, 'Clothing']
                        )
                      }
                    />
                    Clothing
                  </Label>
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filters.category.includes('Outdoor')}
                      onCheckedChange={() =>
                        handleFilterChange(
                          'category',
                          filters.category.includes('Outdoor')
                            ? filters.category.filter((c) => c !== 'Outdoor')
                            : [...filters.category, 'Outdoor']
                        )
                      }
                    />
                    Outdoor
                  </Label>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="price">
              <AccordionTrigger className="text-base">Price</AccordionTrigger>
              <AccordionContent>
                <div />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="rating">
              <AccordionTrigger className="text-base">Rating</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filters.rating >= 4}
                      onCheckedChange={() =>
                        handleFilterChange(
                          'rating',
                          filters.rating >= 4 ? 0 : 4
                        )
                      }
                    />
                    4 stars and above
                  </Label>
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filters.rating >= 3}
                      onCheckedChange={() =>
                        handleFilterChange(
                          'rating',
                          filters.rating >= 3 ? 0 : 3
                        )
                      }
                    />
                    3 stars and above
                  </Label>
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filters.rating >= 2}
                      onCheckedChange={() =>
                        handleFilterChange(
                          'rating',
                          filters.rating >= 2 ? 0 : 2
                        )
                      }
                    />
                    2 stars and above
                  </Label>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Search Results</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <ArrowUpDownIcon className="mr-2 h-4 w-4" />
                Sort by
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="end">
              <DropdownMenuRadioGroup
                value={sortBy}
                onValueChange={handleSortChange}
              >
                <DropdownMenuRadioItem value="relevance">
                  Relevance
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-asc">
                  Price: Low to High
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-desc">
                  Price: High to Low
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="rating">
                  Rating
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`group relative ${
                product.promoted ? 'bg-primary/10 rounded-lg p-4' : ''
              }`}
            >
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <img
                src="/placeholder.svg"
                alt={product.name}
                width={300}
                height={300}
                className={`aspect-square w-full rounded-lg object-cover transition-opacity group-hover:opacity-50 ${
                  product.promoted ? 'aspect-[4/3]' : ''
                }`}
              />
              {product.promoted && (
                <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                  Promoted
                </div>
              )}
              <div className="flex-1 py-4">
                <h3 className="font-semibold tracking-tight">{product.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-0.5">
                    {[...Array(Math.floor(product.rating))].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-primary" />
                    ))}
                    {product.rating % 1 !== 0 && (
                      <StarIcon className="h-4 w-4 fill-primary" />
                    )}
                    {[...Array(5 - Math.ceil(product.rating))].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="h-4 w-4 fill-muted stroke-muted-foreground"
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    ({product.rating})
                  </span>
                </div>
                <h4 className="font-semibold">${product.price.toFixed(2)}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowUpDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </svg>
  );
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
