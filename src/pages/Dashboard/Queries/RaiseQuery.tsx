/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import Textarea from "../../../components/Reusable/TextArea/TextArea";
import SelectDropdown from "../../../components/Reusable/SelectDropdown/SelectDropdown";
import Button from "../../../components/Reusable/Button/Button";
import { useAddQueryMutation } from "../../../redux/Features/queries/queriesApi";

type RaiseQueryFormData = {
  subject: string;
  message: string;
  priority: "Low" | "Medium" | "High";
  queryType: "Technical" | "Billing" | "Feature Request" | "General" | "Other";
};

const RaiseQuery = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RaiseQueryFormData>({
    defaultValues: {
      subject: "",
      message: "",
      priority: "Medium",
      queryType: "General",
    },
  });

  const [addQuery] = useAddQueryMutation();

  // Options for dropdowns
  const priorityOptions = ["Low", "Medium", "High"];
  const queryTypeOptions = ["Technical", "Billing", "Feature Request", "General", "Other"];

  const handleSubmitQuery = async (data: RaiseQueryFormData) => {
    try {
      const formData = new FormData();

      // Append form fields
      formData.append("subject", data.subject);
      formData.append("message", data.message);
      formData.append("priority", data.priority);
      formData.append("queryType", data.queryType);

      const result = await addQuery(formData).unwrap();
      
      if (result.success) {
        toast.success("Query submitted successfully! Our team will respond shortly.");
        // Reset form
        reset();
        
        // Navigate back to queries page after 2 seconds
        setTimeout(() => {
          navigate("/dashboard/queries");
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit query. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitQuery)}
      className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/dashboard/queries" aria-label="Go back">
          <FiArrowLeft size={24} className="text-gray-600 mt-1" />
        </Link>
        <h1 className="text-neutral-5 text-2xl font-semibold">
          Ask a Question
        </h1>
      </div>

      {/* Subject & Query Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Subject"
          placeholder="Enter a clear subject for your question"
          error={errors.subject}
          {...register("subject", {
            required: "Subject is required",
            minLength: {
              value: 5,
              message: "Subject must be at least 5 characters",
            },
          })}
        />

        <SelectDropdown
          label="Query Type"
          options={queryTypeOptions}
          error={errors.queryType}
          {...register("queryType", { required: "Query type is required" })}
        />
      </div>

      {/* Priority & (empty for layout balance) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectDropdown
          label="Priority"
          options={priorityOptions}
          error={errors.priority}
          {...register("priority", { required: "Priority is required" })}
        />
      </div>

      {/* Message */}
      <Textarea
        label="Message"
        placeholder="Please provide detailed information about your question..."
        error={errors.message}
        {...register("message", {
          required: "Message is required",
          minLength: {
            value: 10,
            message: "Message must be at least 10 characters",
          },
        })}
      />

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <div className="text-blue-600 text-sm font-medium">📌</div>
          <div>
            <p className="text-sm text-neutral-5">
              <span className="font-medium">What happens next?</span>
            </p>
            <p className="text-sm text-neutral-20 mt-1">
              Our support team will review your query and respond within 24-48 hours. 
              You'll receive a notification when someone answers.
            </p>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Link to="/dashboard/queries">
          <Button type="button" variant="secondary" label="Cancel" />
        </Link>
        <Button
          type="submit"
          isDisabled={isSubmitting}
          label={isSubmitting ? "Submitting..." : "Submit Query"}
        />
      </div>
    </form>
  );
};

export default RaiseQuery;