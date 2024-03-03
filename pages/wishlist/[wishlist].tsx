import MainLayout from '@/components/MainLayout';
import { type NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import {
  ArrowUpDown,
  Check,
  Edit,
  MoreHorizontal,
  RefreshCcw,
  Settings,
  X
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import LoadingPage from '@/components/LoadingPage';
import Signin from '@/pages/signin';
import useWishlistStore from '@/stores/wishlistStore';
import { useEffect } from 'react';
import useAuthStore from '@/stores/authStore';
import { useStore } from '@/stores/store';
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
import WishlistSearchbox from '@/components/WishlistSearchbox';
import { WishlistCard } from '@/stores/wishlistStore';
import { Item } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

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

const CardPreview = ({
  card,
  getWebsiteNameByCode
}: {
  card: WishlistCard | null;
  getWebsiteNameByCode: (code: string) => string;
}) => {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex-1 text-sm text-muted-foreground text-left">
        {card ? (
          <div className="">
            <Image
              alt={card.card_name}
              src={card.cheapest_price_doc.image}
              className="rounded-lg h-auto"
              width={200}
              height={200}
            />
            <div className="p-3" />
            {/* <p className="text-md font-bold">{card.cheapest_price_doc.name}</p> */}

            <Button
              variant="default"
              className="justify-between w-[200px] text-sm tracking-tight"
              onClick={() =>
                window.open(card.cheapest_price_doc.link, '_blank')
              }
            >
              <p className="text-left overflow-ellipsis whitespace-nowrap overflow-hidden">
                Buy @ {getWebsiteNameByCode(card.cheapest_price_doc.website)}{' '}
              </p>
              <p className="font-bold ">
                {new Intl.NumberFormat('en-CA', {
                  style: 'currency',
                  currency: 'CAD'
                }).format(card.cheapest_price_doc.price)}
              </p>
            </Button>
            {/* <Button variant="ghost" className="w-[200px] text-sm tracking-tight" onClick={() => {
              console.log("open modal")
            }}>
              Change settings
            </Button> */}
          </div>
        ) : (
          <div>
            <div
              // image placeholder
              className="w-[200px] h-[280px] bg-zinc-800 opacity-70 rounded-lg"
            ></div>
            <div className="p-2" />
            <div
              // button placeholder
              className="w-[200px] h-9 bg-zinc-800 opacity-70 rounded-lg"
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

function getColumns(
  deleteWishlistItem: (wishlistItemId: number) => void,
  getWebsiteNameByCode: (code: string) => string
): ColumnDef<WishlistCard>[] {
  return [
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
      header: 'Qty',
      accessorKey: 'quantity'

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
      accessorKey: 'card_name',
      enableSorting: true,
      cell: ({ row }) => {
        const card = row.original;
        return (
          <div className="text-left max-w-[200px] overflow-ellipsis overflow-hidden whitespace-nowrap">
            {card.card_name}
          </div>
        );
      }
    },
    {
      header: 'Condition',
      accessorKey: 'cheapest_price_doc.condition'
    },
    {
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        // Access the nested property using dot notation
        const price = parseFloat(
          row.original.cheapest_price_doc.price.toFixed(2)
        );
        console.log(row);
        const formatted = new Intl.NumberFormat('en-CA', {
          style: 'currency',
          currency: 'CAD'
        }).format(price);
        return <div className="text-left font-medium">{formatted}</div>;
      },
      accessorKey: 'cheapest_price_doc.price',
      enableSorting: true
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const wishlistCard = row.original;
        return (
          <Dialog>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Edit card</DialogTitle>
                <DialogDescription className="text-pink-500">
                  {/* Adjust preferences for this card and save when you're done. */}
                  This feature is in development
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <p className="font-bold">Dockside Extortionist</p>
                <div className="flex flex-row justify-between items-center">
                  <Label htmlFor="name" className="text-left">
                    Minimum Condition
                  </Label>
                  <Select
                    // disabled
                    disabled
                  >
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
                  <Label htmlFor="email-notifications" className="text-left">
                    Email Notifications
                  </Label>
                  <Switch id="email-notifications" disabled />
                </div>
                <div className="flex flex-row justify-between items-center">
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
                    disabled
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled className="bg-zinc-800">
                  Save changes
                </Button>
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
                    window.open(wishlistCard.cheapest_price_doc.link, '_blank');
                  }}
                >
                  Open link in new tab
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem>Email Settings</DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem
                  onClick={() => {
                    deleteWishlistItem(wishlistCard.wishlist_item_id);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Dialog>
        );
      }
    }
  ];
}

type Props = {};
const WishlistId: NextPage<Props> = () => {
  const router = useRouter();
  const { wishlist } = router.query as { wishlist: string };
  const { isAuthenticated } = useAuthStore();
  const {
    wishlistView,
    fetchWishlistView,
    updateWishlist,
    deleteWishlistItem
  } = useWishlistStore();
  const { getWebsiteNameByCode } = useStore();
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState('');
  const [edit, setEdit] = useState(false);
  const columns: ColumnDef<WishlistCard>[] = getColumns(
    deleteWishlistItem,
    getWebsiteNameByCode
  );

  const saveChanges = (wishlist_id: number) => {
    try {
      updateWishlist(wishlist_id, editName);

      exitEditMode();
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };
  const toggleEditMode = () => {
    if (edit) {
      exitEditMode();
    } else {
      enterEnterMode();
    }
  };
  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };
  const [hoveredCard, setHoveredCard] = useState<WishlistCard | null>(null);
  const exitEditMode = () => {
    setEditName('');
    setEdit(false);
  };
  const enterEnterMode = () => {
    setEditName(wishlistView.name);

    setEdit(true);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        if (wishlist) fetchWishlistView(Number(wishlist));
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [isAuthenticated, wishlist]);

  useEffect(() => {
    if (wishlistView.items.length > 0 && !hoveredCard) {
      setHoveredCard(wishlistView.items[0]);
    } else if (wishlistView.items.length === 0) {
      setHoveredCard(null);
    }
  }, [wishlistView]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Signin />;
  }
  return (
    <>
      <WishlistIdHead />
      <MainLayout>
        <div className="w-full max-w-6xl flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="container grid items-start gap-6">
              <div className="space-y-2 text-left">
                <div className="flex flex-row gap-4">
                  {edit ? (
                    <div className="flex flex-row gap-4 items-center">
                      <Input
                        value={editName}
                        onChange={handleEditNameChange}
                        autoFocus
                        className="max-w-md"
                      />
                      <Check
                        size={16}
                        onClick={(e) => {
                          e.preventDefault();
                          saveChanges(wishlistView.wishlist_id);
                        }}
                      />
                      <X size={16} onClick={exitEditMode} />
                    </div>
                  ) : (
                    <div className="flex flex-row gap-4 items-center">
                      <h2 className="text-3xl font-bold tracking-tighter">
                        {wishlistView.name}
                      </h2>
                      <Edit
                        size={16}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleEditMode();
                        }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Created {dayjs(wishlistView.created_at).fromNow()}
                </p>
              </div>
              <div className="flex flex-row gap-8 w-full">
                <div className="hidden md:flex max-w-xs w-[200px]">
                  <CardPreview
                    card={hoveredCard}
                    getWebsiteNameByCode={getWebsiteNameByCode}
                  />
                </div>
                <div className="w-full">
                  <div className="flex flex-row justify-between items-center">
                    <div className="hidden sm:flex sm:flex-row gap-4 items-center">
                      {/* <Button variant="outline" className="w-35">
                        Settings
                      </Button> */}
                      {/* button for toggling bulk edit */}
                      <Link href={`/wishlist/${wishlistView.wishlist_id}/edit`}>
                      <Button variant="outline" className="w-35">
                        Bulk edit
                      </Button>
                      </Link>
                      <RefreshCcw size={16} />
                      <div className="p-2" />
                    </div>
                    <WishlistSearchbox
                      wishlistId={wishlistView.wishlist_id}
                      className="max-w-md"
                    />
                  </div>
                  {wishlistView.items.length === 0 ? (
                    <div className="w-full h-full rounded-lg flex flex-col items-center justify-center relative">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
                        <p className="text-lg font-bold">No cards found</p>
                        <p className="text-sm">
                          Add cards by search or bulk edit. 
                        </p>
                      </div>
                      <div className="w-full h-16 bg-zinc-800 opacity-70 rounded-lg mt-4 justify-center flex items-center" />
                      <div className="w-full h-60 bg-zinc-800 opacity-70 rounded-lg mt-4 justify-center flex items-center" />
                    </div>
                  ) : (
                    <DataTable
                    
                      columns={columns}
                      deleteRow={deleteWishlistItem}
                      data={wishlistView.items}
                      setHoveredCard={setHoveredCard}
                    />
                  )}
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
      <title>Wishlist</title>
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
