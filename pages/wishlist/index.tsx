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
import Signin from '@/pages/signin';
import LoadingPage from '@/components/LoadingPage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Edit } from 'lucide-react';
type Props = {};

const Wishlist: NextPage<Props> = () => {
  const { wishlists, fetchWishlists, createWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  // can be null or number
  const [editWishlistId, setEditWishlistId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };

  const saveChanges = (wishlist_id: number) => {
    console.log('save changes');
    exitEditMode();
  };

  const onSubmit = async (data: { name: string }) => {
    await createWishlist(data.name);
    setIsDialogOpen(false);
  };
  const enterEditMode = (id: number) => {
    setEditWishlistId(id);
  };

  const exitEditMode = () => {
    setEditWishlistId(null);
  };
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: 'My Wishlist'
    }
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserWishlists = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        await fetchWishlists();
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserWishlists();
  }, [isAuthenticated]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Signin />;
  }

  return (
    <>
      <WishlistHead />
      <MainLayout>
        <div className="w-full max-w-2xl flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="container grid max-[1fr_900px] md:px-6 items-start gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tighter">
                  Wishlists
                </h2>
              </div>

              <div className="grid gap-4">
                {wishlists.map((wishlist) => (
                  <Link href={`/wishlist/${wishlist.id}`}>
                    <Card key={wishlist.id}>
                      <CardHeader className="flex-row justify-between items-center">
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
                            enterEditMode(wishlist.id);
                          }}
                        />
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          {wishlist.item_count} cards
                        </CardDescription>
                      </CardContent>
                      {editWishlistId === wishlist.id && (
                        <CardFooter
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <Button
                            variant="default"
                            onClick={() => saveChanges(wishlist.id)}
                          >
                            Save
                          </Button>
                          <Button variant="default" onClick={exitEditMode}>
                            Cancel
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
              <Button variant="default" onClick={() => setIsDialogOpen(true)}>
                New wishlist
              </Button>
              <Dialog open={isDialogOpen}>
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
                      <DialogTrigger asChild>
                        <Button type="submit">Save</Button>
                      </DialogTrigger>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </section>
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
