/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  useAddIssueMutation,
  useGetSingleIssueQuery,
  useUpdateIssueMutation,
} from "../../../redux/Features/issues/issuesApi";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import Textarea from "../../../components/Reusable/TextArea/TextArea";
import SelectDropdown from "../../../components/Reusable/SelectDropdown/SelectDropdown";
import Button from "../../../components/Reusable/Button/Button";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

type RaiseOrEditIssueFormData = {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  images?: string[];
  status?: "Pending" | "Ongoing" | "Resolved" | "Closed";
  resolution?: string;
};

const RaiseOrEditIssue = () => {
  const { id } = useParams();
  const { data: issueData, isLoading: isLoadingIssue } = useGetSingleIssueQuery(
    id!,
    { skip: !id },
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<RaiseOrEditIssueFormData>({
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      images: [],
      status: "Pending",
      resolution: "",
    },
  });

  const [addIssue] = useAddIssueMutation();
  const [updateIssue] = useUpdateIssueMutation();

  // Options for dropdowns
  const priorityOptions = ["Low", "Medium", "High", "Urgent"];

  const statusOptions = ["Pending", "Ongoing", "Resolved", "Closed"];

  // Set default values when editing
  useEffect(() => {
    if (id && issueData?.data) {
      const issue = issueData.data;
      reset({
        title: issue.title || "",
        description: issue.description || "",
        priority: issue.priority || "Medium",
        images: issue.images || [],
        status: issue.status || "Pending",
        resolution: issue.resolution || "",
      });
    }
  }, [issueData, reset]);

  const handleSubmitIssue = async (data: RaiseOrEditIssueFormData) => {
    try {
      const payload = {
        ...data,
        // If adding, status is Pending by default
        status: !id ? "Pending" : data.status,
      };

      if (!id) {
        const result = await addIssue(payload).unwrap();
        if (result.success) {
          toast.success("Issue raised successfully");
          reset();
        }
      } else {
        const result = await updateIssue({
          id: id!,
          data: payload,
        }).unwrap();
        if (result.success) {
          toast.success("Issue updated successfully");
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || `Something went wrong`);
    }
  };

  if (id && isLoadingIssue) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-10"></div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitIssue)}
      className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6 space-y-4"
    >
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/dashboard/issues"
          aria-label="Go back"
        >
          <FiArrowLeft size={24} className="text-gray-600 mt-1" />
        </Link>
        <h1 className="text-neutral-5 text-2xl font-semibold">
          {id ? "Edit" : "Raise an"} Issue
        </h1>
      </div>
      {/* Title & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Issue Title"
          placeholder="Enter a clear and concise title"
          error={errors.title}
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 5,
              message: "Title must be at least 5 characters",
            },
          })}
        />

        <SelectDropdown
          label="Priority"
          options={priorityOptions}
          error={errors.priority}
          {...register("priority", { required: "Priority is required" })}
        />
      </div>

      {/* Description */}
      <Textarea
        label="Description"
        placeholder="Provide detailed description of the issue..."
        error={errors.description}
        {...register("description", {
          required: "Description is required",
          minLength: {
            value: 10,
            message: "Description must be at least 10 characters",
          },
        })}
      />

      {/* Status (Only for Edit Mode) */}
      {id && (
        <SelectDropdown
          label="Status"
          options={statusOptions}
          error={errors.status}
          {...register("status")}
        />
      )}

      {/* Resolution (Only for Edit Mode when status is Resolved/Closed) */}
      {id && (
        <Textarea
          label="Resolution"
          placeholder="Enter resolution details..."
          {...register("resolution")}
          isRequired={false}
        />
      )}

      {/* Images Upload Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Screenshots / Attachments
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-10 transition-colors cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id="imageUpload"
            // Handle image upload logic here
          />
          <label htmlFor="imageUpload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-600">
                Click to upload screenshots
              </p>
              <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
            </div>
          </label>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Note:</span> Once submitted, our team
          will review your issue and get back to you within 24-48 hours.
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" label="Cancel" />
        <Button
          type="submit"
          isDisabled={isSubmitting}
          label={
            isSubmitting
              ? !id
                ? "Raising..."
                : "Updating..."
              : !id
                ? "Raise Issue"
                : "Update Issue"
          }
        />
      </div>
    </form>
  );
};

export default RaiseOrEditIssue;
