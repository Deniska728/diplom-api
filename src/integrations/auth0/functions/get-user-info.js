import request from 'request-promise';

const getUserInfo = async ({ token, iss }) => {
  let user;
  try {
    user = JSON.parse(await request(`${iss}userinfo`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }));
  } catch (err) {
    console.log(err);
  }

  return user;
};

export default getUserInfo;
