import { apiSlice } from "../api/apiSlice";

export const serverApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getServerInfo: build.query({
      query: () => ({
        url: "/server",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetServerInfoQuery } = serverApiSlice;
