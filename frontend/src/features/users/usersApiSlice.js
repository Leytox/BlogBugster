import { apiSlice } from "../api/apiSlice.js";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query({
      query: ({ limit, page, search }) => ({
        url: `/users?limit=${limit}&page=${page}&searchTerm=${search}`,
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

    getUserSubscriptions: build.query({
      query: (id) => ({
        url: `/users/${id}/subscriptions`,
        methods: "GET",
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
      query: ({ id, body }) => ({
        url: `/users/${id}/ban`,
        method: "POST",
        body,
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
  useGetUserSubscriptionsQuery,
  useSubscribeMutation,
  useUnsubscribeMutation,
  useBanMutation,
  useUnbanMutation,
} = usersApiSlice;
