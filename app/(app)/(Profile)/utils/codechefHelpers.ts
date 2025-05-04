import AsyncStorage from '@react-native-async-storage/async-storage';
import { CodechefAPIResponse } from '../types';

export const CODECHEF_CACHE_KEY = 'cached_codechef_data';
export const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

export const loadCachedCodechefData = async (
  username: string,
  ratingsData: any,
  setLatestCodechefData: (data: CodechefAPIResponse) => void,
  setRatingsData: (data: any) => void
) => {
  try {
    const cachedData = await AsyncStorage.getItem(`${CODECHEF_CACHE_KEY}_${username}`);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData) as CodechefAPIResponse;

      const now = Date.now();
      if (parsedData.cachedAt && now - parsedData.cachedAt < CACHE_EXPIRY) {
        console.log('Using cached CodeChef data for:', username);
        setLatestCodechefData(parsedData);

        if (ratingsData?.codechef) {
          const updatedRatingsData = {
            ...ratingsData,
            codechef: {
              ...ratingsData.codechef,
              rating: parsedData.currentRating || ratingsData.codechef.rating,
              maxRating: parsedData.highestRating || ratingsData.codechef.maxRating,
              rank: parsedData.stars || ratingsData.codechef.rank
            }
          };
          setRatingsData(updatedRatingsData);
        }

        return true;
      } else {
        console.log('Cached CodeChef data expired for:', username);
        return false;
      }
    }
    return false;
  } catch (error) {
    console.error('Error loading cached CodeChef data:', error);
    return false;
  }
};

export const cacheCodechefData = async (username: string, data: CodechefAPIResponse) => {
  try {
    const dataToCache = {
      ...data,
      cachedAt: Date.now()
    };

    await AsyncStorage.setItem(
      `${CODECHEF_CACHE_KEY}_${username}`,
      JSON.stringify(dataToCache)
    );
    console.log('Cached CodeChef data for:', username);
  } catch (error) {
    console.error('Error caching CodeChef data:', error);
  }
};

export const fetchLatestCodechefData = async (
  username: string,
  isFetchingCodechef: React.MutableRefObject<boolean>,
  ratingsData: any,
  latestCodechefData: CodechefAPIResponse | null,
  setLatestCodechefData: (data: CodechefAPIResponse) => void,
  setRatingsData: (data: any) => void,
  forceRefresh = false
) => {
  if (!username || (isFetchingCodechef.current && !forceRefresh)) return;

  try {
    isFetchingCodechef.current = true;

    if (!forceRefresh) {
      const cacheUsed = await loadCachedCodechefData(
        username, 
        ratingsData, 
        setLatestCodechefData, 
        setRatingsData
      );
      if (cacheUsed) {
        isFetchingCodechef.current = false;
        return;
      }
    }

    console.log('Fetching CodeChef data for:', username);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`https://codechef-api.vercel.app/handle/${username}`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();

      if (data && data.success) {
        setLatestCodechefData(data);

        cacheCodechefData(username, data);

        if (ratingsData?.codechef) {
          const updatedRatingsData = {
            ...ratingsData,
            codechef: {
              ...ratingsData.codechef,
              rating: data.currentRating || ratingsData.codechef.rating,
              maxRating: data.highestRating || ratingsData.codechef.maxRating,
              rank: data.stars || ratingsData.codechef.rank
            }
          };
          setRatingsData(updatedRatingsData);
        }
      } else {
        console.log('API returned unsuccessful response:', data);
      }
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error fetching latest CodeChef data:', error);

    if (!latestCodechefData && ratingsData?.codechef) {
      setLatestCodechefData({
        success: true,
        status: 200,
        currentRating: ratingsData.codechef.rating,
        highestRating: ratingsData.codechef.maxRating,
        stars: ratingsData.codechef.rank
      });
    }
  } finally {
    isFetchingCodechef.current = false;
  }
};
