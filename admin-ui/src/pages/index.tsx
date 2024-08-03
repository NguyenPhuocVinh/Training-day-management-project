import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if (accessToken && refreshToken) {
      setIsAuthenticated(true);
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return null;
};

export default Home;
