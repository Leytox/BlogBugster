import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { logout } from "../auth/authSlice.js";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URI,
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Wait for any other refresh calls before proceeding
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // The token has expired
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // Attempt to refresh the token
        const refreshResult = await baseQuery(
          { url: "/auth/refresh", method: "POST" },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          // Retry the original request with new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh token has failed, log the user out or handle accordingly
          api.dispatch(logout()); // Implement the logout action in your auth slice
        }
      } finally {
        // Release the mutex regardless of success or failure
        release();
      }
    } else {
      // Wait until the mutex is released before retrying the original request
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Users"],
  endpoints: (build) => ({}),
});
