import { apiSlice } from "../api/apiSlice.js";

const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAllPosts: build.query({
      query: () => "/posts",
    }),
    getPost: build.query({
      query: (id) => `/posts/${id}`,
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
      query: ({ id, body }) => ({
        url: `/posts/${id}/comments`,
        method: "POST",
        body,
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
  }),
});

export const {
  useGetAllPostsQuery,
  useGetPostQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = postsApiSlice;
