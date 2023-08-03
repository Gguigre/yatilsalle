import axios from "axios";

export const getUserEmail = async (access_token) => {
  const response = await axios.get(
    "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.data.email;
};
