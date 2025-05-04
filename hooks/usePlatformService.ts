import { useState } from 'react';
import { PLATFORM_DATA, SAMPLE_DATA } from '@/constants/AppConstants';
import { RatingsData } from '@/types/platform-interfaces';
import getCodeforcesUserInfo from '@/api/codeforcesApis/getCFUserInfoByHandle';
import getLeetcodeUserInfo from '@/api/leetcodeApis/getLCUserInfoByHandle';
import getCodechefUserInfo from '@/api/codechefApis/getCCUserInfoByHandle';

export default function usePlatformService() {
  const [ratingsData, setRatingsData] = useState<RatingsData>({
    codeforces: {
      platformName: PLATFORM_DATA.CODEFORCES.PLATFORM_NAME,
      rating: 0,
      username: "",
      maxRating: 0,
      rank: "",
      backgroundColor: PLATFORM_DATA.CODEFORCES.BACKGROUND_COLOR,
      textColor: PLATFORM_DATA.CODEFORCES.TEXT_COLOR,
      logoUri: PLATFORM_DATA.CODEFORCES.LOGO_URI,
      isError: false,
      errorMessage: ""
    },
    leetcode: {
      platformName: PLATFORM_DATA.LEETCODE.PLATFORM_NAME,
      rating: 0,
      username: "",
      maxRating: 0,
      rank: "",
      backgroundColor: PLATFORM_DATA.LEETCODE.BACKGROUND_COLOR,
      textColor: PLATFORM_DATA.LEETCODE.TEXT_COLOR,
      logoUri: PLATFORM_DATA.LEETCODE.LOGO_URI,
      isError: false,
      errorMessage: ""
    },
    codechef: {
      platformName: PLATFORM_DATA.CODECHEF.PLATFORM_NAME,
      rating: 0,
      username: "",
      maxRating: 0,
      rank: "",
      backgroundColor: PLATFORM_DATA.CODECHEF.BACKGROUND_COLOR,
      textColor: PLATFORM_DATA.CODECHEF.TEXT_COLOR,
      logoUri: PLATFORM_DATA.CODECHEF.LOGO_URI,
      isError: false,
      errorMessage: ""
    }
  });

  const updateCodeforcesData = async (username: string) => {
    try {
      const userInfo = await getCodeforcesUserInfo(username);
      
      if (userInfo) {
        setRatingsData(prev => ({
          ...prev,
          codeforces: {
            ...prev.codeforces,
            username: userInfo.handle,
            rating: userInfo.rating,
            maxRating: userInfo.maxRating,
            rank: userInfo.rank.charAt(0).toUpperCase() + userInfo.rank.slice(1),
            isError: false,
            errorMessage: ""
          }
        }));
        return true;
      } else {
        setRatingsData(prev => ({
          ...prev,
          codeforces: {
            ...prev.codeforces,
            username: username,
            rating: 0,
            maxRating: 0,
            rank: "Invalid",
            isError: true,
            errorMessage: "Username not found on Codeforces"
          }
        }));
        return false;
      }
    } catch (error) {
      console.error("Error in updateCodeforcesData:", error);
      setRatingsData(prev => ({
        ...prev,
        codeforces: {
          ...prev.codeforces,
          username: username,
          isError: true,
          errorMessage: "Failed to fetch Codeforces data. Please try again later."
        }
      }));
      return false;
    }
  };

  const updateLeetcodeData = async (username: string) => {
    try {
      const data = await getLeetcodeUserInfo(username);
      
      if (data && data.contestRating) {
        setRatingsData(prev => ({
          ...prev,
          leetcode: {
            ...prev.leetcode,
            username: username,
            rating: Math.floor(data.contestRating),
            maxRating: 0,
            rank: data.contestBadges?.name || "User",
            isError: false,
            errorMessage: ""
          }
        }));
        return true;
      } else {
        setRatingsData(prev => ({
          ...prev,
          leetcode: {
            ...prev.leetcode,
            username: username,
            rating: 0,
            maxRating: 0,
            rank: "Invalid",
            isError: true,
            errorMessage: "Username not found on Leetcode"
          }
        }));
        return false;
      }
    } catch (error) {
      console.error("Error in updateLeetcodeData:", error);
      setRatingsData(prev => ({
        ...prev,
        leetcode: {
          ...prev.leetcode,
          username: username,
          rating: 0,
          maxRating: 0,
          isError: true,
          errorMessage: "Failed to fetch Leetcode data. Please try again later."
        }
      }));
      return false;
    }
  };

  const updateCodechefData = async (username: string) => {
    try {
      const userInfo = await getCodechefUserInfo(username);
      
      if (userInfo) {
        setRatingsData(prev => ({
          ...prev,
          codechef: {
            ...prev.codechef,
            username: username,
            rating: userInfo.currentRating,
            maxRating: userInfo.highestRating,
            rank: userInfo.stars,
            isError: false,
            errorMessage: ""
          }
        }));
        return true;
      } else {
        setRatingsData(prev => ({
          ...prev,
          codechef: {
            ...prev.codechef,
            username: username,
            rating: 0,
            maxRating: 0,
            rank: "Invalid",
            isError: true,
            errorMessage: "Username not found on CodeChef"
          }
        }));
        return false;
      }
    } catch (error) {
      console.error("Error in updateCodechefData:", error);
      setRatingsData(prev => ({
        ...prev,
        codechef: {
          ...prev.codechef,
          username: username,
          rating: 0,
          maxRating: 0,
          isError: true,
          errorMessage: "Failed to fetch CodeChef data. Please try again later."
        }
      }));
      return false;
    }
  };

  const setDefaultPlatformData = () => {
    setRatingsData(prev => ({
      codeforces: {
        ...prev.codeforces,
        rating: SAMPLE_DATA.CODEFORCES.RATING,
        maxRating: SAMPLE_DATA.CODEFORCES.MAX_RATING,
        rank: SAMPLE_DATA.CODEFORCES.RANK
      },
      leetcode: {
        ...prev.leetcode,
        rating: SAMPLE_DATA.LEETCODE.RATING,
        maxRating: 0,
        rank: SAMPLE_DATA.LEETCODE.RANK
      },
      codechef: {
        ...prev.codechef,
        rating: SAMPLE_DATA.CODECHEF.RATING,
        maxRating: SAMPLE_DATA.CODECHEF.MAX_RATING,
        rank: SAMPLE_DATA.CODECHEF.RANK
      }
    }));
  };

  return {
    ratingsData,
    setRatingsData,
    updateCodeforcesData,
    updateLeetcodeData,
    updateCodechefData,
    setDefaultPlatformData
  };
}
