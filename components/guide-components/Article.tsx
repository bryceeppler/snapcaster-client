import { ArticleObject } from '@/articles/buyers-guide-mtg';
import Image from 'next/image';
type Props = {
  content: ArticleObject[];
};

export default function Article(props: Props) {
  return (
    <>
      {props.content.map((state) => (
        <div className="mb-6" key={state.header}>
          <h2 className="mb-3 text-2xl font-medium">{state.header}</h2>
          <p className="mb-6">{state.content}</p>

          <Image
            src={state.image}
            alt={state.imageTitle}
            width={250}
            height={400}
            className="mx-auto mb-4 rounded-lg border border-zinc-600"
          />
          <p className="text-center text-sm italic">{state.imageTitle}</p>
        </div>
      ))}
    </>
  );
}
