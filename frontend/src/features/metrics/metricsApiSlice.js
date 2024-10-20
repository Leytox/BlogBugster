import { apiSlice } from "../api/apiSlice";

export const metricsApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMetrics: build.query({
      query: () => ({
        url: "/metrics",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetMetricsQuery } = metricsApiSlice;
