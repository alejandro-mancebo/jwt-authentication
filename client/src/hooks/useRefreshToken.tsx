import { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth }: any = useAuth();

  const refresh = async () => {

    const response = await axiosPrivate.get('/refresh', {
      withCredentials: true
    });

    console.log('use refresh token')
    console.log('useRefreshToken: ', response);
    setAuth((prev: any) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken }
    });

    return response.data.accessToken;

  }
  return refresh;
}

export default useRefreshToken