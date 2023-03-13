import React from 'react'

type Props = {
    data : {
        title: string,
        date: string
    } []
}

export default function Updates({ data }: Props) {
  return (
    <div className='outline outline-offset-2 outline-1 p-1 outline-zinc-900 rounded-md text-left'>
        <h3 className="p-2">Updates</h3>
        {
            data.map((update, index) => {
                return (
                    <div key={index}
                        className={`p-2 ${
                            index === data.length - 1 ? '' : 'border-b'
                        } border-zinc-900 flex flex-row text-sm justify-between transition-colors rounded-md text-left `}
                    >
                        <h2>{update.title}</h2>
                        {/* <p>{update.description}</p> */}
                        <p className='text-zinc-500 text-right'>{update.date}</p>
                    </div>
                )
            })
        }
    </div>
  )
}