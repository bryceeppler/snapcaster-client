import MainLayout from '@/components/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';

const LoadingPage = () => {
  return (
    <>
      <MainLayout>
        <div className="w-full max-w-xl flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="container grid max-[1fr_900px] md:px-6 items-start gap-6">
              <div className="mx-auto">
                <LoadingSpinner />
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  );
};

export default LoadingPage;
