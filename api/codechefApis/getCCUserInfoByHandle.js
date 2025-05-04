/**
 * Fetches CodeChef user information by username
 * @param {string} username - The CodeChef username to fetch data for
 * @returns {Promise<{
 *   name: string,
 *   currentRating: number,
 *   highestRating: number,
 *   stars: string,
 *   globalRank: number,
 *   countryRank: number,
 *   profile?: string,
 *   countryName?: string
 * }|null>} - Returns user data or null if not found
 */
async function getUserInfo(username) {
  try {
    const response = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
    const data = await response.json();
    
    if (data && data.success) {
      return {
        name: data.name || username,
        currentRating: data.currentRating || 0,
        highestRating: data.highestRating || 0,
        stars: data.stars || "",
        globalRank: data.globalRank || 0,
        countryRank: data.countryRank || 0,
        profile: data.profile,
        countryName: data.countryName
      };
    }
    console.log("CodeChef API returned unsuccessful response for user:", username);
    return null;
  } catch (error) {
    console.error("Error fetching CodeChef user info:", error);
    return null;
  }
}

export default getUserInfo;
