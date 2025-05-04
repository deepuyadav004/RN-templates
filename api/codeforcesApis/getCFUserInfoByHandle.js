/**
 * Fetches Codeforces user information by username
 * @param {string} username - The Codeforces username
 * @returns {Promise<Object|null>} - Returns user data or null
 */
async function getUserInfo(username) {
  try {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    const data = await response.json();
    
    if (data.status === "OK" && data.result.length > 0) {
      const userInfo = data.result[0];
      return {
        handle: userInfo.handle,
        rating: userInfo.rating || 0,
        maxRating: userInfo.maxRating || 0,
        rank: userInfo.rank || "",
        maxRank: userInfo.maxRank || "",
        titlePhoto: userInfo.titlePhoto || "",
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching Codeforces user info:", error);
    return null;
  }
}

export default getUserInfo;
