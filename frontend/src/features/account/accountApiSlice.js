import { apiSlice } from "../api/apiSlice.js";

export const accountApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAccount: build.query({
      query: () => ({
        url: "/account",
        method: "GET",
      }),
    }),

    updateAccount: build.mutation({
      query: (body) => ({
        url: "/account",
        method: "PUT",
        body,
      }),
    }),

    deleteAccount: build.mutation({
      query: () => ({
        url: "/account",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAccountQuery,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = accountApiSlice;
