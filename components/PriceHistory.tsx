import React from 'react'
import Line from './Line'
import { useStore } from 'store';
import Loadingspinner from './Loadingspinner';
type Props = {}

export default function PriceHistory({}: Props) {
  const { singleSearchPriceList:data } = useStore();
  return (
    <div className="h-40 sm:h-56 mt-4 flex flex-col space-x-4 max-w-xl justify-center items-center">
    {/* <img
        src={`${data.image}`}
        alt='Card Image'
        className='h-40 w-auto rounded-md'
      /> */}
   <div className="text-lg font-extrabold text-white">Price History</div> 
        <Line />
    </div>
  )

}