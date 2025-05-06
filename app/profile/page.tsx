import { redirect } from 'next/navigation';

type Props = {};

function ProfilePage({}: Props) {
  return redirect('/account');
}

export default ProfilePage;
