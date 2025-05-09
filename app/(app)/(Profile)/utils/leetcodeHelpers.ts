export const loadCachedLeetcodeData = async (
  username: string,
  ratingsData: any,
  setLatestLeetcodeData: (data: any) => void,
  setRatingsData: (data: any) => void
) => {
  // Skip cache loading to ensure data is fresh and consistent with home page
  return false;
};

export const fetchLatestLeetcodeData = async (
  username: string,
  isFetchingLeetcode: React.MutableRefObject<boolean>,
  ratingsData: any,
  latestLeetcodeData: any | null,
  setLatestLeetcodeData: (data: any) => void,
  setRatingsData: (data: any) => void,
  forceRefresh = false
) => {
  if (!username || (isFetchingLeetcode.current && !forceRefresh)) return;

  try {
    isFetchingLeetcode.current = true;

    // Always fetch fresh data, skip cache check
    console.log('Fetching LeetCode data for:', username);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/contest`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();

      if (data && data.contestAttend) {
        setLatestLeetcodeData(data);

        if (ratingsData?.leetcode) {
          const updatedRatingsData = {
            ...ratingsData,
            leetcode: {
              ...ratingsData.leetcode,
              rating: Math.floor(data.contestRating) || ratingsData.leetcode.rating,
              maxRating: Math.floor(data.contestRating) || ratingsData.leetcode.maxRating,
              rank: data.contestBadges?.name || ratingsData.leetcode.rank,
              isError: false,
              errorMessage: ""
            }
          };
          setRatingsData(updatedRatingsData);
        }
      } else {
        console.log('API returned unsuccessful response:', data);
        throw new Error('Invalid data format from LeetCode API');
      }
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      
      if (ratingsData?.leetcode) {
        setRatingsData(prev => ({
          ...prev,
          leetcode: {
            ...prev.leetcode,
            isError: true,
            errorMessage: "Failed to fetch LeetCode data. Please try again later."
          }
        }));
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error('Error fetching latest LeetCode data:', error);
    
    if (ratingsData?.leetcode) {
      setRatingsData(prev => ({
        ...prev,
        leetcode: {
          ...prev.leetcode,
          isError: true,
          errorMessage: "Failed to fetch LeetCode data. Please try again later."
        }
      }));
    }
  } finally {
    isFetchingLeetcode.current = false;
  }
};