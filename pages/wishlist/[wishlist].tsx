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
import WishlistSearchbox from '@/components/WishlistSearchbox';
import { WishlistCard } from '@/stores/wishlistStore';
import Link from 'next/link';
import { toast } from 'sonner';

export type Card = {
  name: string;
  condition: string;
  price: number;
  link: string;
  image: string;
  website: string;
};

type Props = {};
const WishlistId: NextPage<Props> = () => {
  const router = useRouter();
  const { wishlist } = router.query as { wishlist: string };
  const { isAuthenticated } = useAuthStore();
  const {
    wishlistView,
    fetchWishlistView,
    updateWishlist,
    deleteWishlistItem,
    updateWishlistItem
  } = useWishlistStore();
  const { getWebsiteNameByCode } = useStore();
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState('');
  const [edit, setEdit] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false); // controls refresh icon rotation

  const columns: ColumnDef<WishlistCard>[] = getColumns(
    deleteWishlistItem,
    getWebsiteNameByCode,
    updateWishlistItem
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
  const fetchWishlistData = async (wishlistId: number) => {
    setIsRefreshing(true); // Start rotation
    try {
      await fetchWishlistView(wishlistId);
    } catch (error) {
      console.error('Error refreshing wishlist data:', error);
    } finally {
      setIsRefreshing(false); // Stop rotation
      toast.success('Wishlist refreshed');
    }
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
        <div className="container">
          <div className="mx-auto items-center gap-6">
            <div className="space-y-2 text-left">
              <div className="flex flex-row gap-4">
                {edit ? (
                  <div className="flex flex-row items-center gap-4">
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
                  <div className="flex flex-row items-center gap-4">
                    <h2 className="text-4xl font-bold tracking-tighter">
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
            <div className="flex w-full flex-row gap-8">
              <div className="hidden lg:flex">
                <CardPreview
                  card={hoveredCard}
                  getWebsiteNameByCode={getWebsiteNameByCode}
                />
              </div>
              <div className="w-full">
                <div className="flex flex-row items-center justify-between">
                  <div className="hidden items-center gap-4 md:flex md:flex-row">
                    <Link href={`/wishlist/${wishlistView.wishlist_id}/edit`}>
                      <Button variant="outline" className="w-35">
                        Bulk edit
                      </Button>
                    </Link>
                    <RefreshCcw
                      size={16}
                      className={`hover:cursor-pointer ${
                        isRefreshing ? 'animate-spin' : ''
                      }`}
                      onClick={() =>
                        fetchWishlistData(wishlistView.wishlist_id)
                      }
                    />
                    <div className="p-2" />
                  </div>
                  <WishlistSearchbox
                    wishlistId={wishlistView.wishlist_id}
                    className="max-w-md"
                  />
                </div>
                {wishlistView.items.length === 0 ? (
                  <div className="relative flex h-full w-full flex-col items-center justify-center rounded-lg">
                    <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-center">
                      <p className="text-lg font-bold">No cards found</p>
                      <p className="text-sm">
                        Add cards by search or bulk edit.
                      </p>
                    </div>
                    <div className="mt-4 flex h-16 w-full items-center justify-center rounded-lg bg-muted opacity-70" />
                    <div className="mt-4 flex h-60 w-full items-center justify-center rounded-lg bg-muted opacity-70" />
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
        </div>
      </MainLayout>
    </>
  );
};

export default WishlistId;

const CardPreview = ({
  card,
  getWebsiteNameByCode
}: {
  card: WishlistCard | null;
  getWebsiteNameByCode: (code: string) => string;
}) => {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex-1 text-left text-sm text-muted-foreground">
        {card ? (
          <div className="">
            <img
              alt={card.card_name}
              src={card.cheapest_price_doc.image}
              className="h-auto rounded-lg transition-all"
              width={200}
              height={200}
            />
            <div className="p-3" />

            <Button
              variant="default"
              className="w-[200px] justify-between text-sm tracking-tight"
              onClick={() =>
                window.open(card.cheapest_price_doc.link, '_blank')
              }
            >
              <p className="overflow-hidden overflow-ellipsis whitespace-nowrap text-left">
                Buy @ {getWebsiteNameByCode(card.cheapest_price_doc.website)}{' '}
              </p>
              <p className="font-bold ">
                {new Intl.NumberFormat('en-CA', {
                  style: 'currency',
                  currency: 'CAD'
                }).format(card.cheapest_price_doc.price)}
              </p>
            </Button>
          </div>
        ) : (
          <div className="">
            <div
              // image placeholder
              className="h-[280px] w-[200px] rounded-lg bg-red-800 opacity-70"
            ></div>
            <div className="p-2" />
            <div
              // button placeholder
              className="h-9 w-[200px] rounded-lg bg-muted opacity-70"
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

function getColumns(
  deleteWishlistItem: (wishlistItemId: number) => void,
  getWebsiteNameByCode: (code: string) => string,
  updateWishlistItem: (
    wishlistItemId: number,
    quantity: number,
    minimumCondition: string,
    targetPrice: number,
    emailNotifications: boolean
  ) => void
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
          <div className="max-w-[100px] overflow-hidden overflow-ellipsis whitespace-nowrap text-left md:max-w-[200px]">
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
        const [newMinimumCondition, setNewMinimumCondition] = useState(
          row.original.minimum_condition
        );
        const [newQuantity, setNewQuantity] = useState(row.original.quantity);
        const handleSaveChanges = () => {
          updateWishlistItem(
            row.original.wishlist_item_id,
            newQuantity,
            newMinimumCondition,
            row.original.target_price, // Use state-managed value if this is editable
            row.original.email_notifications // Use state-managed value if this is editable
          );
        };

        return (
          <Dialog>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>{wishlistCard.card_name}</DialogTitle>
                <DialogDescription className="text-pink-500">
                  This feature is in development
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between">
                  {/* Quantity */}
                  <Label htmlFor="quantity" className="text-left">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={0}
                    step={1}
                    defaultValue={row.original.quantity}
                    className="w-[180px] text-left"
                    onChange={(e) => {
                      setNewQuantity(parseInt(e.target.value));
                    }}
                  />
                </div>
                <div className="flex flex-row items-center justify-between">
                  <Label htmlFor="name" className="text-left">
                    Minimum Condition
                  </Label>
                  <Select
                    defaultValue={row.original.minimum_condition}
                    onValueChange={setNewMinimumCondition}
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
                <div className="flex flex-row items-center justify-between">
                  <Label htmlFor="email-notifications" className="text-left">
                    Email Notifications
                  </Label>
                  <Switch id="email-notifications" disabled />
                </div>
                <div className="flex flex-row items-center justify-between">
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
                <Button
                  type="submit"
                  className="bg-muted"
                  onClick={handleSaveChanges}
                >
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
                  <DropdownMenuItem>Edit</DropdownMenuItem>
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
