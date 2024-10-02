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

    verifyPassword: build.mutation({
      query: (body) => ({
        url: "/account/verify-password",
        method: "POST",
        body,
      }),
    }),

    generate2FAToken: build.mutation({
      query: () => ({
        url: "/account/generate-2fa-token",
        method: "POST",
      }),
    }),

    enable2FA: build.mutation({
      query: (body) => ({
        url: "/account/enable-2fa",
        method: "POST",
        body,
      }),
    }),

    disable2FA: build.mutation({
      query: () => ({
        url: "/account/disable-2fa",
        method: "POST",
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
  useVerifyPasswordMutation,
  useGenerate2FATokenMutation,
  useEnable2FAMutation,
  useDisable2FAMutation,
  useDeleteAvatarMutation,
  useDeleteAccountMutation,
} = accountApiSlice;
