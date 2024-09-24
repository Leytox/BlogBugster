import { apiSlice } from "../api/apiSlice.js";

const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAllPosts: build.query({
      query: () => "/posts",
    }),
    getPosts: build.query({
      query: ({ page, limit, category, sortOrder, searchTerm }) =>
        `/posts?page=${page}&limit=${limit}&category=${category}&sortOrder=${sortOrder}&searchTerm=${searchTerm ? searchTerm : ""}`,
    }),
    getPost: build.query({
      query: (id) => `/posts/${id}`,
    }),
    getUserPosts: build.query({
      query: (userid) => `/posts/user/${userid}`,
    }),
    likePost: build.mutation({
      query: (id) => ({
        url: `/posts/${id}/like`,
        method: "POST",
      }),
    }),
    unlikePost: build.mutation({
      query: (id) => ({
        url: `/posts/${id}/unlike`,
        method: "POST",
      }),
    }),
    createPost: build.mutation({
      query: (body) => ({
        url: `/posts`,
        method: "POST",
        body,
      }),
    }),
    updatePost: build.mutation({
      query: ({ id, body }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body,
      }),
    }),
    deletePost: build.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
    }),
    createComment: build.mutation({
      query: ({ id, body, parentCommentId }) => ({
        url: `/posts/${id}/comments`,
        method: "POST",
        body,
        parentCommentId,
      }),
    }),
    likeComment: build.mutation({
      query: ({ id, commentId }) => ({
        url: `/posts/${id}/comments/${commentId}/like`,
        method: "POST",
      }),
    }),
    unlikeComment: build.mutation({
      query: ({ id, commentId }) => ({
        url: `/posts/${id}/comments/${commentId}/unlike`,
        method: "POST",
      }),
    }),
    updateComment: build.mutation({
      query: ({ id, commentId, body }) => ({
        url: `/posts/${id}/comments/${commentId}`,
        method: "PUT",
        body,
      }),
    }),
    deleteComment: build.mutation({
      query: ({ id, commentId }) => ({
        url: `/posts/${id}/comments/${commentId}`,
        method: "DELETE",
      }),
    }),
    loadCommentReplies: build.query({
      query: ({ id, commentId }) =>
        `/posts/${id}/comments/${commentId}/replies`,
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetAllPostsQuery,
  useGetPostQuery,
  useGetUserPostsQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLoadCommentRepliesQuery,
  useCreateCommentMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = postsApiSlice;
