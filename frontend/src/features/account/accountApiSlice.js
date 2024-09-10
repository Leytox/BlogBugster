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

    changePassword: build.mutation({
      query: (body) => ({
        url: "/account/change-password",
        method: "POST",
        body,
      }),
    }),

    uploadAvatar: build.mutation({
      query: (file) => ({
        url: "/account/avatar",
        method: "POST",
        body: file,
      }),
    }),

    deleteAvatar: build.mutation({
      query: () => ({
        url: "/account/avatar",
        method: "DELETE",
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
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useDeleteAvatarMutation,
  useDeleteAccountMutation,
} = accountApiSlice;
