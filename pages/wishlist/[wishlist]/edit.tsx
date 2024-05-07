import MainLayout from '@/components/MainLayout';
import { type NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import axios from 'axios';
import { Check, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingPage from '@/components/LoadingPage';
import Signin from '@/pages/signin';
import useWishlistStore from '@/stores/wishlistStore';
import { useEffect } from 'react';
import useAuthStore from '@/stores/authStore';
import { useStore } from '@/stores/store';
import { Input } from '@/components/ui/input';
dayjs.extend(relativeTime);
import { useState } from 'react';
import { WishlistCard } from '@/stores/wishlistStore';
import { Textarea } from '@/components/ui/textarea';
// import axios err

import axiosInstance from '@/utils/axiosWrapper';
import { toast } from 'sonner';
import Link from 'next/link';

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
    deleteWishlistItem
  } = useWishlistStore();
  const { getWebsiteNameByCode } = useStore();
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState('');
  const [edit, setEdit] = useState(false);
  const [cardNames, setCardNames] = useState('');
  const [missingCards, setMissingCards] = useState<string[]>([]);
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

  const submitBulkEdit = async () => {
    const cardNamesArray = cardNames.trim().split('\n');
    // remove any empty strings or new lines
    const filteredCardNamesArray = cardNamesArray.filter(
      (cardName) => cardName.trim() !== ''
    );

    // if > 100 cards, raise toast and return
    if (filteredCardNamesArray.length > 100) {
      toast.error('You can only have 100 cards in a wishlist.');
      return;
    }
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_WISHLIST_URL}/${wishlistView.wishlist_id}/bulk`,
        {
          cardNames: filteredCardNamesArray
        }
      );

      // clear old missing cards
      setMissingCards([]);
      toast.success('Changes saved!');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handle axios error in toast
        if (error.response?.status === 404) {
          toast.error('Some cards were not found in the database');
          setMissingCards(error.response.data.missingCardNames);
        } else {
          toast.error('Failed to submit bulk edit: ' + error.message);
        }
      }
      console.error('Failed to submit bulk edit:', error);
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
    // Check if there are items in the wishlist
    if (wishlistView.items.length > 0) {
      // Concatenate the names of each card, separated by new lines
      //   we want quantity + name
      const namesWithQuantity = wishlistView.items.map((item) => {
        return `${item.quantity} ${item.card_name}`;
      });
      setCardNames(namesWithQuantity.join('\n'));
    } else {
      // If there are no items, clear the content
      setCardNames('');
    }
  }, [wishlistView.items]); // Dependency array ensures this runs when wishlistView.items changes

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
            <div className="container grid items-start gap-6 md:px-6">
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

              {/* textarea */}
              <Textarea
                value={cardNames}
                className="h-48"
                onChange={(e) => setCardNames(e.target.value)}
              />
              {missingCards.length > 0 && (
                <div className="outlined-container overflow-ellipsis p-6 text-left">
                  <strong className="font-bold">
                    Some cards were not found:
                  </strong>
                  {/* divider */}
                  <div className="h-2" />
                  <ul className="text-xs">
                    {missingCards.map((card, index) => (
                      <li key={index}>{card}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Buttons */}
              <div className="flex flex-row">
                <div className="flex-1" />
                <div className="flex flex-row gap-4">
                  <Link href={`/wishlist/${wishlistView.wishlist_id}`}>
                    <Button className="min-w-20">Exit</Button>
                  </Link>

                  <Button className="min-w-20" onClick={submitBulkEdit}>
                    Save
                  </Button>
                  {/* <Button>Save & Continue Editing</Button> */}
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
