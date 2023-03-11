import React, { PureComponent } from 'react';
import { LineChart, Line as ReLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStore } from 'store';

// const data = [
//   {
//     date: 'Date 1',
//     max: 4000,
//     min: 2400,
//     avg: 2400,
//   },
//   {
//     date: 'Date 2',
//     max: 3000,
//     min: 1398,
//     avg: 2210,
//   },
//   {
//     date: 'Date 3',
//     max: 2000,
//     min: 9800,
//     avg: 2290,
//   },
//   {
//     date: 'Date 4',
//     max: 2780,
//     min: 3908,
//     avg: 2000,
//   },
//   {
//     date: 'Date 5',
//     max: 1890,
//     min: 4800,
//     avg: 2181,
//   },
// ];

type Props = {}

export default function Line({}: Props) {
  const { singleSearchPriceList:data } = useStore();

  return (

    

    <ResponsiveContainer width="100%" height="100%">
    <LineChart
      width={200}
      height={300}
      // data={data}
      // let data be type any before passing it to LineChart
      data={data as any}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip 
        contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      />
      <Legend />
      <ReLine type="monotone" dataKey="min" stroke="#8884d8" />
      <ReLine type="monotone" dataKey="avg" stroke="#FDE01A" activeDot={{ r: 8 }} />
      <ReLine type="monotone" dataKey="max"  stroke="#FF0000" />

    </LineChart>
  </ResponsiveContainer>





  )
}
