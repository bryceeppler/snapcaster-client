import React, { useEffect, useState } from 'react';
import { IQueueStats } from '@/pages/tools/scraper-report';

type Props = {
  data: IQueueStats;
};
const QueueStats: React.FC<Props> = ({ data }: Props): React.ReactElement => {
  const [queueStats, setQueueStats] = useState<IQueueStats>(data);

  useEffect(() => {
    setQueueStats(data);
  }, [data]);

  return (
    <div className="w-full overflow-clip rounded bg-zinc-800">
      <h3 className="bg-zinc-900 bg-opacity-40 p-5 text-xl font-semibold">
        ImageProcessingQueue
      </h3>
      <div className="p-2"></div>
      <div className="w-full overflow-x-scroll px-5 sm:overflow-x-auto">
        <table className="w-full">
          <thead className="text-zinc-300">
            <tr>
              <th className="text-left text-sm font-light">
                Messages available
              </th>
              <th className="text-left text-sm font-light">
                Messages in flight
              </th>
            </tr>
          </thead>
          <tbody className="font-bold text-white" data-testid="queue-stats">
            <tr>
              <td>{queueStats.messages_available}</td>
              <td>{queueStats.messages_in_flight}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="p-2"></div>
    </div>
  );
};

export default QueueStats;
