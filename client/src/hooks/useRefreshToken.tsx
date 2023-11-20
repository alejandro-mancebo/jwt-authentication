import { axiosPublic } from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth }: any = useAuth();

  const refresh = async () => {
    const response = await axiosPublic.post('/refresh', {},
      {
        withCredentials: true
      });

    setAuth((prev: any) => {
      return {
        ...prev,
        _id: response.data._id,
        name: response.data.name,
        accessToken: response.data.accessToken
      }
    });

    return response.data.accessToken;
  }

  return refresh;
}

export default useRefreshToken