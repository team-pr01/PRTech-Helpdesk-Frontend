/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  useAddIssueMutation,
  useGetProjectsByClientUserIdQuery,
  useGetSingleIssueQuery,
  useUpdateIssueMutation,
} from "../../../redux/Features/issues/issuesApi";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import Textarea from "../../../components/Reusable/TextArea/TextArea";
import SelectDropdown from "../../../components/Reusable/SelectDropdown/SelectDropdown";
import Button from "../../../components/Reusable/Button/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiX, FiUpload } from "react-icons/fi";

type RaiseOrEditIssueFormData = {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent" | string;
  status?: "Pending" | "Ongoing" | "Resolved" | "Closed";
  resolution?: string;
  project: string;
};

const RaiseOrEditIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const { data: issueData, isLoading: isLoadingIssue } = useGetSingleIssueQuery(
    id!,
    { skip: !id },
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RaiseOrEditIssueFormData>({
    defaultValues: {
      title: "",
      description: "",
      priority: "",
      status: "Pending",
      resolution: "",
      project: "",
    },
  });

  const { data: projectData } = useGetProjectsByClientUserIdQuery({});

  const [addIssue] = useAddIssueMutation();
  const [updateIssue] = useUpdateIssueMutation();

  // Options for dropdowns
  const priorityOptions = ["low", "medium", "high", "urgent"];
  const statusOptions = ["pending", "ongoing", "answered", "closed"];

  // Set default values when editing
  useEffect(() => {
    if (id && issueData?.data) {
      const issue = issueData.data;
      reset({
        title: issue.title || "",
        description: issue.description || "",
        priority: issue.priority || "Medium",
        status: issue.status || "Pending",
        resolution: issue.resolution || "",
        project: issue.project || "",
      });

      // Set existing images
      if (issue.images && issue.images.length > 0) {
        setExistingImages(issue.images);
      }
    }
  }, [issueData, reset, id]);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Check total images limit (max 2)
    const totalImages = imageFiles.length + files.length;
    if (totalImages > 2) {
      toast.error("You can upload maximum 2 images");
      return;
    }

    // Check file size (max 5MB each)
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setImageFiles([...imageFiles, ...validFiles]);

      // Create preview URLs
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  // Remove image
  const removeImage = (index: number, isExisting = false) => {
    if (isExisting) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      // Revoke object URL to avoid memory leaks
      URL.revokeObjectURL(imagePreviews[index]);
      setImageFiles(imageFiles.filter((_, i) => i !== index));
      setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleSubmitIssue = async (data: RaiseOrEditIssueFormData) => {
    try {
      const formData = new FormData();

      // Append form fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("priority", data.priority);
      formData.append("project", data.project);

      if (!id) {
        formData.append("status", "Pending");
      } else {
        if (data.status) formData.append("status", data.status);
        if (data.resolution) formData.append("resolution", data.resolution);
      }

      // Append image files
      imageFiles.forEach((file) => {
        formData.append("files", file);
      });

      // Append existing image URLs (for update)
      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      if (!id) {
        const result = await addIssue(formData).unwrap();
        if (result.success) {
          toast.success("Issue raised successfully");
          // Reset form
          reset();
          setImageFiles([]);
          setImagePreviews([]);
          navigate("/dashboard/issues");
        }
      } else {
        const result = await updateIssue({
          id: id!,
          data: formData,
        }).unwrap();
        if (result.success) {
          toast.success("Issue updated successfully");
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || `Something went wrong`);
    }
  };

  const projectOptions =
    projectData?.data?.map((project: any) => ({
      value: project?._id,
      label: project?.name,
    })) || [];

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
      className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-4 md:p-6 space-y-4"
    >
      <div className="flex items-center gap-3 mb-6">
        <Link to="/dashboard/issues" aria-label="Go back">
          <FiArrowLeft size={24} className="text-gray-600 mt-1 text-xl" />
        </Link>
        <h1 className="text-neutral-5 text-xl md:text-2xl font-semibold">
          {id ? "Edit" : "Raise an"} Issue
        </h1>
      </div>

      {/* Title & Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Issue Title"
          placeholder="Enter a clear and concise title"
          error={errors.title}
          {...register("title", {
            required: "Title is required",
          })}
        />

        <SelectDropdown
          label="Priority"
          options={priorityOptions}
          error={errors.priority}
          {...register("priority", { required: "Priority is required" })}
        />
      </div>

      <div>
        <label className="flex flex-row items-center w-full justify-between text-neutral-65 mb-2">
          <span className="text-neutral-10 leading-[18px] text-[15px] font-medium tracking-[-0.16] ">
            Project <span className="text-primary-10">*</span>
          </span>
        </label>
        <select
          aria-label="Project"
          {...register("project", { required: "Project is required" })}
          className={`w-full px-4 py-[11px] rounded-lg border 
  leading-[18px] focus:outline-none focus:border-primary-10 
  transition duration-300 capitalize 
  disabled:cursor-not-allowed
  whitespace-normal break-words border-neutral-45/20 bg-white cursor-pointer
`}
        >
          <option value="">Select Project</option>
          {projectOptions.map((project: any) => (
            <option key={project.value} value={project.value}>
              {project.label}
            </option>
          ))}
        </select>
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

      {/* Resolution (Only for Edit Mode) */}
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
          <span className="text-xs text-gray-400 ml-2">
            (Max 2 images, up to 5MB each)
          </span>
        </label>

        {/* Image Preview Grid */}
        {(imagePreviews.length > 0 || existingImages.length > 0) && (
          <div className="flex gap-3 mb-3">
            {/* Existing Images */}
            {existingImages.map((image, index) => (
              <div key={`existing-${index}`} className="relative group">
                <img
                  src={image}
                  alt={`Existing attachment ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index, true)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}

            {/* New Images */}
            {imagePreviews.map((preview, index) => (
              <div key={`new-${index}`} className="relative group">
                <img
                  src={preview}
                  alt={`Attachment preview ${index + 1}`}
                  className="size-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index, false)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {imageFiles.length + existingImages.length < 2 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-10 transition-colors cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id="imageUpload"
              onChange={handleImageSelect}
            />
            <label htmlFor="imageUpload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <FiUpload className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Click to upload screenshots
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, JPEG up to 5MB each
                </p>
                <p className="text-xs text-primary-10">
                  {imageFiles.length + existingImages.length}/2 images uploaded
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Max images reached message */}
        {imageFiles.length + existingImages.length >= 2 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <p className="text-sm text-yellow-700">
              Maximum 2 images reached. Remove an image to upload another.
            </p>
          </div>
        )}
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
        <Link to="/dashboard/issues">
          <Button type="button" variant="secondary" label="Cancel" />
        </Link>
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
