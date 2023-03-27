import {
  createBrowserSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import { WatchlistItem } from 'pages/watchlist';
import { ProductWithPrice } from 'types';
import type { Database } from 'types_db';

export const supabase = createBrowserSupabaseClient<Database>();

export const getActiveProductsWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
  }
  // TODO: improve the typing here.
  return (data as any) || [];
};

export const updateUserName = async (user: User, name: string) => {
  await supabase
    .from('users')
    .update({
      full_name: name
    })
    .eq('id', user.id);
};

export const getPriceWatchEntries = async (user: User) => {
  const { data, error } = await supabase
    .from('price_watch_entries')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.log(error.message);
  }

  return data as WatchlistItem | []
}


export const addPriceWatchEntry = async (
  user: User,
  cardName: string,
  threshold: number
) => {
  const { data, error } = await supabase
    .from('price_watch_entries')
    .insert({
      user_id: user.id,
      card_name: cardName,
      threshold
    });

  if (error) {
    console.log(error.message);
  }

  return data;
}

