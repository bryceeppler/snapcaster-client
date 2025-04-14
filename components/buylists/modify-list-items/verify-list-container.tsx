import useBuyListStore from '@/stores/useBuylistStore';
import { CartItem } from './list-item';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VerifyListContainerProps {
  closeMobileCartDialog: () => void;
}
export const VerifyListContainer = ({
  closeMobileCartDialog
}: VerifyListContainerProps) => {
  const { currentCart } = useBuyListStore();
  return (
    <div className="h-full">
      <ScrollArea className="h-full" type="always">
        <div className="p-2">
          {currentCart?.items.map((item: any, index) => (
            <div key={index}>
              <CartItem item={item} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
