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

    getAccount: build.query({
      query: () => ({
        url: "/users/account",
        method: "GET",
      }),
    }),

    updateAccount: build.mutation({
      query: (body) => ({
        url: "/users/account",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    deleteAccount: build.mutation({
      query: () => ({
        url: "/users/account",
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetAccountQuery,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = usersApiSlice;
