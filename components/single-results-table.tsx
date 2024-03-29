import React from 'react';
import { useStore } from '@/stores/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SingleSearchResult } from '@/stores/store';
type Props = {
  cardData: SingleSearchResult[];
};
import { trackOutboundLink } from '@/utils/analytics';
const SingleResultsTable = (props: Props) => {
  function handleBuyClick(link: string, price: number) {
    const domain = link.split('/')[2];
    const priceInCents = price * 100;
    trackOutboundLink(domain, priceInCents);
  }

  const { websites } = useStore();

  const findWebsiteNameByCode = (code: string): string => {
    const website = websites.find((website) => website.code === code);
    return website ? website.name : 'Website not found';
  };

  return (
    <Table className="text-left">
      <TableHeader>
        <TableRow>
          <TableCell>Name</TableCell>

          <TableCell>Set</TableCell>
          <TableCell>Website</TableCell>
          <TableCell>Condition</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Link</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.cardData.map((cardData, index) => (
          <TableRow key={index}>
            <TableCell>{cardData.name}</TableCell>

            <TableCell>{cardData.set}</TableCell>
            <TableCell>{findWebsiteNameByCode(cardData.website)}</TableCell>
            <TableCell>{cardData.condition}</TableCell>
            <TableCell>{cardData.price}</TableCell>
            <TableCell>
              <Link
                href={cardData.link}
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <Button
                  onClick={() => handleBuyClick(cardData.link, cardData.price)}
                  className="w-full"
                >
                  Buy
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SingleResultsTable;
