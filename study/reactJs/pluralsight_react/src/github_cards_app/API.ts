import axios from "axios";

const GITHUB_API_URL = "https://api.github.com/users/";

interface GithubUserNotFound {
  avatar_url: null;
  name: null;
  company: null;
  error: string;
}

const getUserFromGithubAPI = async (username: string) => {
  try {
    const res = await axios.get(`${GITHUB_API_URL}${username}`);
    return res.data;
  } catch (error) {
    console.warn(
      "getUserFromGithubAPI",
      `Could not retrieve user ${username} from ${GITHUB_API_URL}: Error: ${error.message}`
    );
    const notFoundUser: GithubUserNotFound = {
      avatar_url: null,
      name: null,
      company: null,
      error: error.message,
    };
    return notFoundUser;
  }
};

export default getUserFromGithubAPI;
