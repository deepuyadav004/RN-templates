async function getUserInfo(handleName){
    try {
        const response = await fetch(`https://codeforces.com/api/user.info?handles=${handleName}`)
        .then((res) => res.json());
        return response;
    } catch {
        console.log("Error in fetching user info with user name: ", handleName);
    }

    return null;
}

export default getUserInfo;