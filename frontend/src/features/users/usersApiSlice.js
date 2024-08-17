import { apiSlice } from "../api/apiSlice.js";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),

    getUser: build.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
    }),

    subscribe: build.mutation({
      query: (id) => ({
        url: `/users/${id}/subscribe`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    unsubscribe: build.mutation({
      query: (id) => ({
        url: `/users/${id}/unsubscribe`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    ban: build.mutation({
      query: (id) => ({
        url: `/users/${id}/ban`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    unban: build.mutation({
      query: (id) => ({
        url: `/users/${id}/unban`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useSubscribeMutation,
  useUnsubscribeMutation,
  useBanMutation,
  useUnbanMutation,
} = usersApiSlice;
