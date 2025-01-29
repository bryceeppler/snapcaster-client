import useGlobalStore from '@/stores/globalStore';

export default function Review() {
  const { websites } = useGlobalStore();
  console.log(websites)
  return <div>Review</div>;
}
