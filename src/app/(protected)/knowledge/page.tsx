'use client';

import { useSession } from 'next-auth/react';

const Page = () => {
  const { data: user } = useSession();
  console.log({ user });

  return <div>Knowledge page</div>;
};

export default Page;
