import { axiosPublic } from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth }: any = useAuth();
  const accessToken: (string | null) = localStorage.getItem('jwt');

  const refresh = async () => {
    const response = await axiosPublic.post('/refresh',
      JSON.stringify({ accessToken }), {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      withCredentials: true
    });

    console.log('useRefreshToken token: ', response);
    setAuth((prev: any) => {
      console.log('useRefreshToken previos token:', JSON.stringify(prev));
      console.log('useRefreshToken current token:', response.data.accessToken);
      return {
        ...prev,
        email: response.data.email,
        accessToken: response.data.accessToken
      }
    });

    return response.data.accessToken;
  }
  return refresh;
}

export default useRefreshToken