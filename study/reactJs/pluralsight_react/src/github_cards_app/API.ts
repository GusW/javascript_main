import axios from "axios";

const GITHUB_API_URL = "https://api.github.com/users/";

const consumeGithubAPI = async (username: string) => {
  const res = await axios.get(`${GITHUB_API_URL}${username}`);
  return res.data;
};

export default consumeGithubAPI;
