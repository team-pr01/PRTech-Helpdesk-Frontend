/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const queriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all queries with filters and pagination
    getAllQueries: builder.query({
      query: ({
        page,
        limit,
        skip,
        status,
        priority,
        queryType,
        keyword,
        dateFrom,
        dateTo,
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
        page?: number;
        status?: string;
        priority?: string;
        queryType?: string;
        dateFrom?: string;
        dateTo?: string;
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (typeof page === "number") params.append("page", page.toString());
        if (status) params.append("status", status);
        if (priority) params.append("priority", priority);
        if (queryType) params.append("queryType", queryType);
        if (dateFrom) params.append("dateFrom", dateFrom);
        if (dateTo) params.append("dateTo", dateTo);

        return {
          url: `/queries?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["queries"],
    }),

    // Get single query by ID
    getSingleQuery: builder.query({
      query: (id) => ({
        url: `/queries/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["queries"],
    }),

    // Add new query
    addQuery: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `/queries/add`,
        method: "POST",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: ["queries"],
    }),

    // Update query (answer query)
    updateQuery: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/queries/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["queries"],
    }),

    // Delete query
    deleteQuery: builder.mutation<any, string>({
      query: (id) => ({
        url: `/queries/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["queries"],
    }),

    // Answer a query (update status and add answer)
    answerQuery: builder.mutation<any, { id: string; answer: string }>({
      query: ({ id, answer }) => ({
        url: `/queries/answer/${id}`,
        method: "PATCH",
        body: { answer, status: "Answered" },
        credentials: "include",
      }),
      invalidatesTags: ["queries"],
    }),

    // Get query statistics
    getQueryStatistics: builder.query({
      query: () => ({
        url: `/queries/statistics`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["queries"],
    }),

    // Get my queries (for logged-in user)
    getMyQueries: builder.query({
      query: ({
        page,
        limit,
        skip,
        status,
      }: {
        page?: number;
        limit?: number;
        skip?: number;
        status?: string;
      } = {}) => {
        const params = new URLSearchParams();
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (typeof page === "number") params.append("page", page.toString());
        if (status) params.append("status", status);
        
        return {
          url: `/queries/my-queries?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["queries"],
    }),
  }),
});

export const {
  useGetAllQueriesQuery,
  useGetSingleQueryQuery,
  useAddQueryMutation,
  useUpdateQueryMutation,
  useDeleteQueryMutation,
  useAnswerQueryMutation,
  useGetQueryStatisticsQuery,
  useGetMyQueriesQuery,
} = queriesApi;