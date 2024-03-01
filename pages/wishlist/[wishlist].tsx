import MainLayout from '@/components/MainLayout';
import { type NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
dayjs.extend(relativeTime);
type Props = {};
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import Image from 'next/image';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export type Card = {
  name: string;
  condition: string;
  price: number;
  link: string;
  image: string;
  website: string;
};

export const columns: ColumnDef<Card>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: 'name',
    enableSorting: true
  },
  {
    header: 'Condition',
    accessorKey: 'condition'
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      // formate price without CA infront
      const formatted = new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD'
      }).format(price);
      return <div className="text-left font-medium">{formatted}</div>;
    },
    accessorKey: 'price',
    enableSorting: true
  },
  //   {
  //     header: 'Website',
  //     accessorKey: 'website'
  //   },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <Dialog>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Edit card</DialogTitle>
              <DialogDescription>
                Adjust preferences for this card and save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <p className="font-bold">Dockside Extortionist</p>
              <div className="flex flex-row justify-between items-center">
                <Label htmlFor="name" className="text-left">
                  Minimum Condition
                </Label>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Condition</SelectLabel>
                      <SelectItem value="NM">NM</SelectItem>
                      <SelectItem value="LP">LP</SelectItem>
                      <SelectItem value="MP">MP</SelectItem>
                      <SelectItem value="HP">HP</SelectItem>
                      <SelectItem value="DMG">DMG</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-row justify-between items-center">
                {/* toggle email notifications */}
                <Label htmlFor="email-notifications" className="text-left">
                  Email Notifications
                </Label>
                <Switch id="email-notifications" />

              </div>
              {/* if email notifications enabled */}
              <div className="flex flex-row justify-between items-center">
                {/* target price */}
                <Label htmlFor="target-price" className="text-left">
                  Target Price
                </Label>
                <Input
                  id="target-price"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="Enter target price"
                  className="w-[180px] text-left"

                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-zinc-800">Save changes</Button>
            </DialogFooter>
          </DialogContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  window.open(payment.link, '_blank');
                }}
              >
                Open link in new tab
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>Email Settings</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Dialog>
      );
    }
  }
];

const CardPreview = ({ card }: { card: Card | null }) => {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex-1 text-sm text-muted-foreground text-left">
        {card ? (
          <div className="">
            <Image alt={card.name} src={card.image} className="rounded-lg" width={200} height={200} />
            <div className="p-3">
            <p className="text-md font-bold">{card.name}</p>
            <p className="text-zinc-400">{card.website}</p>
            <p className="font-bold">{card.condition}</p>
            <p className="text-lg font-bold">
              {new Intl.NumberFormat('en-CA', {
                style: 'currency',
                currency: 'CAD'
              }).format(card.price)}
            </p>
          </div>
          </div>
        ) : (
          <p>No card selected</p>
        )}
      </div>
    </div>
  );
};
const WishlistId: NextPage<Props> = () => {
  const router = useRouter();
  const { wishlist } = router.query;

  const data = {
    name: "Magda's Dwarf Booty",
    num_cards: 31,
    worst_acceptable_condition: 'LP',
    created_at: '2021-10-10T00:00:00.000Z',
    updated_at: '2021-10-10T00:00:00.000Z',
    cards: [
      {
        name: 'Whispersilk Cloak',
        condition: 'NM',
        price: 5.0,
        link: 'https://cdn.shopify.com/s/files/1/1704/1809/files/Whispersilk-Cloak-Foil-PHED.jpg?v=1698654032',
        image:
          'https://cdn.shopify.com/s/files/1/1704/1809/files/Whispersilk-Cloak-Foil-PHED.jpg?v=1698654032',
        website: '401 Games',
        email_notifications: true
      },
      {
        name: 'Dockside Extortionist',
        condition: 'LP',
        price: 55.45,
        link: '',
        image: 'https://cdn.shopify.com/s/files/1/0533/4912/2222/products/ff188554-0e12-5639-93a1-70698148b309_99746e05-e355-4b11-94a4-f341b63764db.jpg?v=1656439738',
        website: 'Gauntlet',
        email_notifications: true
      }
    ]
  };

  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);

  return (
    <>
      <WishlistIdHead />
      <MainLayout>
        <div className="w-full max-w-6xl flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="container grid md:px-6 items-start gap-6">
              <div className="space-y-2 text-left">
                <h2 className="text-3xl font-bold tracking-tighter">
                  Magda's Dwarf Booty
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {/* Updated in relative time */}
                  Created {dayjs(data.created_at).fromNow()}
                </p>
              </div>
              <div className="flex flex-row gap-8 w-full">
                <div className="hidden md:flex max-w-xs w-[200px]">
                  <CardPreview card={hoveredCard} />
                </div>
                <div className="flex-1">
                  <DataTable
                    columns={columns}
                    data={data.cards}
                    setHoveredCard={setHoveredCard}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  );
};

export default WishlistId;

const WishlistIdHead = () => {
  return (
    <Head>
      <title>Reset Password</title>
      <meta
        name="description"
        content="Search Magic the Gathering cards across Canada"
      />
      <meta
        property="og:title"
        content={`Snapcaster - Search Magic the Gathering cards across Canada`}
      />
      <meta
        property="og:description"
        content={`Find Magic the Gathering singles and sealed product using in Snapcaster. Search your favourite Canadian stores.`}
      />
      <meta property="og:url" content={`https://snapcaster.ca`} />
      <meta property="og:type" content="website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
