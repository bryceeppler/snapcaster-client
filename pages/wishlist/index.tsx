import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { type NextPage } from 'next';
import useWishlistStore from '@/stores/wishlistStore';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useAuthStore from '@/stores/authStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import axiosInstance from '@/utils/axiosWrapper';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import LoadingSpinner from '@/components/LoadingSpinner';
import LoginRequired from '@/components/login-required';
import SubscriptionRequired from '@/components/subscription-required';
import PageTitle from '@/components/ui/page-title';
dayjs.extend(relativeTime);
type Props = {};

const Wishlist: NextPage<Props> = () => {
  const {
    wishlists,
    fetchWishlists,
    createWishlist,
    updateWishlist,
    deleteWishlist
  } = useWishlistStore();
  const { isAuthenticated, hasActiveSubscription } = useAuthStore();
  const [loading, setLoading] = useState(true);
  // can be null or number
  const [editWishlistId, setEditWishlistId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };

  const saveChanges = (wishlist_id: number) => {
    try {
      updateWishlist(wishlist_id, editName);
      fetchWishlists();
      exitEditMode();
    } catch (error) {
      console.error('Failed to save changes:', error);
      toast.error('Failed to save changes');
    }
  };

  const handleDeleteWishlist = (id: number) => {
    try {
      deleteWishlist(id);
    } catch (error) {
      console.error('Failed to delete wishlist:', error);
      toast.error('Failed to delete wishlist');
    }
  };

  const onSubmit = async (data: { name: string }) => {
    createWishlist(data.name);
    setIsDialogOpen(false);
  };
  const enterEditMode = (id: number) => {
    const wishlistToEdit = wishlists.find((wishlist) => wishlist.id === id);
    if (wishlistToEdit) {
      setEditName(wishlistToEdit.name);
    }
    setEditWishlistId(id);
  };

  const toggleEditMode = (id: number) => {
    if (editWishlistId === id) {
      exitEditMode();
    } else {
      enterEditMode(id);
    }
  };

  const exitEditMode = () => {
    setEditWishlistId(null);
    setEditName('');
  };
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: 'My Wishlist'
    }
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const createCheckoutSession = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_PAYMENT_URL}/createcheckoutsession`
      );
      if (response.status !== 200) throw new Error('Failed to create session');
      const data = await response.data;
      console.log('Checkout session created:', data);
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };
  useEffect(() => {
    const fetchUserWishlists = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        fetchWishlists();
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserWishlists();
  }, [isAuthenticated]);

  // if (loading) {
  //   return <LoadingPage />;
  // }

  if (!isAuthenticated) {
    return (
      <LoginRequired
        title="Wishlists"
        message="You must be logged in to use this feature."
      />
    );
  }

  if (!hasActiveSubscription) {
    return (
      <SubscriptionRequired
        title="Wishlists"
        message="You must have an active subscription to use this feature."
        createCheckoutSession={createCheckoutSession}
      />
    );
  }

  return (
    <>
      <WishlistHead />
      <MainLayout>
        <div className="container w-full max-w-xl flex-1 flex-col justify-center text-center">
          <div className="grid items-start gap-6 md:px-6">
            <PageTitle title="Wishlists" />

            <div className="grid gap-4">
              {loading && (
                <LoadingSpinner classNameProps="w-full mt-7 mx-auto" />
              )}
              {wishlists && wishlists.length === 0 && !loading && (
                <p>
                  No wishlists found. Create one to keep track of multiple
                  cards.
                </p>
              )}
              {wishlists &&
                wishlists.map((wishlist) => (
                  <Link
                    href={
                      editWishlistId === wishlist.id
                        ? ''
                        : `/wishlist/${wishlist.id}`
                    }
                    as={
                      editWishlistId === wishlist.id
                        ? ''
                        : `/wishlist/${wishlist.id}`
                    }
                    key={wishlist.id}
                    className="cursor-default"
                  >
                    <Card
                      key={wishlist.id}
                      className={
                        editWishlistId === wishlist.id
                          ? 'cursor-default text-left transition-shadow duration-300 ease-in-out hover:border-zinc-500 hover:shadow-lg'
                          : 'cursor-pointer text-left transition-shadow duration-300 ease-in-out hover:border-zinc-500 hover:shadow-lg'
                      }
                    >
                      <CardHeader className="flex flex-row items-center justify-between gap-4">
                        {editWishlistId === wishlist.id ? (
                          <Input
                            value={editName}
                            onChange={handleEditChange}
                            autoFocus
                          />
                        ) : (
                          <CardTitle>{wishlist.name}</CardTitle>
                        )}
                        <Edit
                          size={16}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleEditMode(wishlist.id);
                          }}
                          className="cursor-pointer"
                        />
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-zinc-400">
                          {wishlist.item_count} cards
                        </CardDescription>
                        <CardDescription className="text-zinc-400">
                          Created {dayjs(wishlist.created_at).fromNow()}
                        </CardDescription>
                      </CardContent>
                      {editWishlistId === wishlist.id && (
                        <CardFooter
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                          className="flex flex-row justify-between"
                        >
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteWishlist(wishlist.id)}
                          >
                            Delete
                          </Button>
                          <div className="flex gap-2">
                            <Button variant="default" onClick={exitEditMode}>
                              Cancel
                            </Button>
                            <Button
                              variant="default"
                              onClick={() => saveChanges(wishlist.id)}
                            >
                              Save
                            </Button>
                          </div>
                        </CardFooter>
                      )}
                    </Card>
                  </Link>
                ))}
            </div>
            <Button variant="default" onClick={() => setIsDialogOpen(true)}>
              New wishlist
            </Button>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(isOpen) => {
                setIsDialogOpen(isOpen);
              }}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>New wishlist</DialogTitle>
                  <DialogDescription>
                    Create a new wishlist to keep track of your cards.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        {...register('name', {
                          required: 'Name is required'
                        })}
                        type="text"
                        id="name"
                        className="col-span-3"
                        placeholder="My Wishlist"
                      />
                      {formState.errors.name && (
                        <p className="text-red-500">
                          {formState.errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                    <DialogTrigger asChild>
                      <Button type="submit">Save</Button>
                    </DialogTrigger>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Wishlist;

const WishlistHead = () => {
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
