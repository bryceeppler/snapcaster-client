import { type NextPage } from 'next';
import LoadingSpinner from './loading-spinner';

type Props = {};

const LoadingPage: NextPage<Props> = () => {
  return (
    <>
      <div className="w-full max-w-xl flex-1 flex-col justify-center text-center">
        <section className="w-full py-6 md:py-12">
          <div className="max-[1fr_900px] container grid items-start gap-6 md:px-6">
            <div className="mx-auto">
              <LoadingSpinner />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LoadingPage;
