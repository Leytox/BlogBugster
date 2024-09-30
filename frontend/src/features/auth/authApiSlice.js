import { apiSlice } from "../api/apiSlice.js";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    login: build.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    verifyViaEmail: build.mutation({
      query: (body) => ({
        url: `/auth/verify-via-email`,
        method: "POST",
        body,
      }),
    }),
    verifyAccount: build.mutation({
      query: (body) => ({
        url: `/auth/verify-account`,
        method: "POST",
        body,
      }),
    }),
    forgotPassword: build.mutation({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: build.mutation({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    isValidToken: build.query({
      query: ({ token }) => `/auth/token-validation/${token}`,
    }),
    googleOAuth: build.mutation({
      query: (body) => ({
        url: "/auth/google",
        method: "POST",
        body,
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useVerifyViaEmailMutation,
  useVerifyAccountMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useIsValidTokenQuery,
  useGoogleOAuthMutation,
} = authApiSlice;
