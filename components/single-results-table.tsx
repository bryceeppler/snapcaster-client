import React from 'react';
import { useStore } from '@/stores/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { SingleSearchResult } from '@/stores/store';
type Props = {
  cardData: SingleSearchResult[];
};

const SingleResultsTable = (props: Props) => {
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SingleResultsTable;
