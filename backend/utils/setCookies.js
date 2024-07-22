export const setAccessTokenCookie = (res, token) => {
  res.cookie("access_token", token, {
    maxAge: 60 * 60 * 1000 * 12, // 12 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
};

// Method for setting the refresh token cookie
export const setRefreshTokenCookie = (res, token) => {
  res.cookie("refresh_token", token, {
    maxAge: 60 * 60 * 1000 * 24 * 7, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
};
