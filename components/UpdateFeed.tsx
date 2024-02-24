export default function UpdateFeed(props: {
  updates: {
    title: string;
    description: string;
    date: string;
  }[];
}) {
  return (
    <section className="w-full py-6 md:py-12 flex justify-center">
      <div className="container grid items-start gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tighter">Updates</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Stay up to date with the latest changes.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {props.updates.map((update, index) => (
            <div
              key={index}
              className="outlined-container p-4 md:p-8 flex flex-col md:gap-2 text-left w-full"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold overflow-hidden overflow-ellipsis tracking-tight">
                    {update.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {update.date}
                  </p>
                </div>
              </div>
              <div className="text-sm text-white pt-4">
                <p>{update.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
