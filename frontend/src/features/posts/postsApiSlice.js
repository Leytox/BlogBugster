import { apiSlice } from "../api/apiSlice.js";

const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAllPosts: build.query({
      query: () => "/posts",
    }),
    getPost: build.query({
      query: (id) => `/posts/${id}`,
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
  }),
});

export const {
  useGetAllPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApiSlice;
