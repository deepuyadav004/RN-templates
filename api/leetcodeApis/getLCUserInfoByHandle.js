async function getUserContestInfo(username) {
    try {
      const url = `https://alfa-leetcode-api.onrender.com/${username}/contest`;
      const response = await fetch(url, {
        headers: {
          'x-rapidapi-host': 'leetcode-api.p.rapidapi.com'
        }
      }).then((res) => res.json());
      return response;
    } catch (error) {
      console.log("Error in fetching Leetcode contest info for user: ", username, error);
      return null;
    }
  }
  
  export default getUserContestInfo;