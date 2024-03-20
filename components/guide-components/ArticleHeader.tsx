type Props = {
  category: string;
  title: string;
};

export default function ArticleHeader(props: Props) {
  return (
    <>
      <div className="mb-6 w-11/12 border-b-[3px] border-pink-600 pb-2">
        <h1 className="pb-2 font-mono text-4xl md:text-6xl">
          {props.category}
        </h1>
        <h2 className="font-mono text-xl md:text-3xl">{props.title}</h2>
      </div>
    </>
  );
}
