import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/state/AuthContext';

export default function withAuth(WrappedComponent: React.ComponentType<any>) {
  return (props: any) => {
    const { isLoggedIn } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      const sessionInfo = sessionStorage.getItem('sessionInfo');
      if (!sessionInfo) {
        router.push('/');
      }
    }, [isLoggedIn, router]);

    return isLoggedIn ? <WrappedComponent {...props} /> : null;
  };
}
