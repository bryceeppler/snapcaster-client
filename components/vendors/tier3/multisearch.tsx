import SectionTitle from "./section-title";
import { PlayIcon } from "@radix-ui/react-icons";

const Multisearch = () => {

  return (
    <section className="bg-white py-20 " id="1-click-checkout">
      <div className="container">
        <SectionTitle
          subtitle="EASY CHECKOUT"
          title="Convert more sales with our friction-free checkout system."
          paragraph="Convert more sales with our friction-free multisearch checkout system. Reduce cart abandonment and increase average order value instantly."
        />
        <div>
          <div className="mx-auto mt-16 pb-4 md:pb-0 lg:px-8">
          <div className="relative">
               {/*Video placeholder  */}
               <div className="relative w-full h-[500px] bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayIcon className="w-16 h-16 text-gray-500" />
                </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Multisearch;
