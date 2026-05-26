/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const issuesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========== ISSUES APIs ==========
    
    // Get all issues with filters and pagination
    getAllIssues: builder.query({
      query: ({
        page,
        limit,
        skip,
        status,
        priority,
        category,
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
        category?: string;
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
        if (category) params.append("category", category);
        if (dateFrom) params.append("dateFrom", dateFrom);
        if (dateTo) params.append("dateTo", dateTo);

        return {
          url: `/issues?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["issues"],
    }),

    // Get single issue by ID
    getSingleIssue: builder.query({
      query: (id) => ({
        url: `/issues/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["issues"],
    }),

    // Add new issue (raise issue)
    addIssue: builder.mutation<any, any>({
      query: (data) => ({
        url: `/issues/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["issues"],
    }),

    // Update issue
    updateIssue: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/issues/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["issues"],
    }),

    // Delete issue
    deleteIssue: builder.mutation<any, any>({
      query: (id) => ({
        url: `/issues/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["issues"],
    }),

    // Update issue status only
    updateIssueStatus: builder.mutation<any, any>({
      query: ({ id, status }) => ({
        url: `/issues/status/${id}`,
        method: "PATCH",
        body: { status },
        credentials: "include",
      }),
      invalidatesTags: ["issues"],
    }),

    // Get issue statistics
    getIssueStatistics: builder.query({
      query: () => ({
        url: `/issues/statistics`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["issues"],
    }),

    // Upload issue attachments
    uploadIssueAttachments: builder.mutation<any, any>({
      query: ({ id, files }) => {
        const formData = new FormData();
        files.forEach((file: File) => {
          formData.append("attachments", file);
        });
        return {
          url: `/issues/${id}/attachments`,
          method: "POST",
          body: formData,
          credentials: "include",
        };
      },
      invalidatesTags: ["issues"],
    }),

    // Delete issue attachment
    deleteIssueAttachment: builder.mutation<any, any>({
      query: ({ issueId, attachmentId }) => ({
        url: `/issues/${issueId}/attachments/${attachmentId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["issues"],
    }),
  }),
});

export const {
  // Issues hooks
  useGetAllIssuesQuery,
  useGetSingleIssueQuery,
  useAddIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
  useUpdateIssueStatusMutation,
  useGetIssueStatisticsQuery,
  useUploadIssueAttachmentsMutation,
  useDeleteIssueAttachmentMutation,
} = issuesApi;