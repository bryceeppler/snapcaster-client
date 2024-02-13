export default function UpdateFeed(
    props: {
        updates: {
            title: string
            description: string
            date: string
        }[]
    }
) {
  return (
    <section className="w-full py-6 md:py-12">
      <div className="container grid max-[1fr_900px] px-4 md:px-6 items-start gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter">Updates</h2>
          <p className="text-gray-500 dark:text-gray-400">Stay up to date with the latest changes.</p>
        </div>
        <div className="grid gap-4 md:gap-4">
          {props.updates.map((update, index) => (
            <div key={index} className="border-t border-gray-200 py-4 grid gap-4 md:gap-2 last:rounded-lg last:divide-y last:divide-y-900 text-left">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                <h3 className="font-semibold overflow-hidden overflow-ellipsis tracking-tight">{update.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{update.date}</p>
                </div>
   
              </div>
              <div className="grid gap-4 text-sm leading-loose pt-4">
                <p>{update.description}</p>
              </div>
            </div>
          ))}
        
        </div>
      </div>
    </section>
  )
}