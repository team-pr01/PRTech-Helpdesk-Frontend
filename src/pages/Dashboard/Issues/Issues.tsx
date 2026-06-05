/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiGrid,
  FiZap,
} from "react-icons/fi";
import { FaRegClock } from "react-icons/fa";
import { formatDate } from "../../../utils/formatDate";
import { Link } from "react-router-dom";
import Button from "../../../components/Reusable/Button/Button";
import { MdKeyboardArrowRight } from "react-icons/md";
import IssueCard from "../../../components/IssuesPage/IssueCard/IssueCard";
import { useGetMyRaisedIssuesQuery } from "../../../redux/Features/issues/issuesApi";
import Loader from "../../../components/Reusable/Loader/Loader";

// Types
export type TIssue = {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "ongoing" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  images?: string[];
  resolvedAt?: string;
  raisedBy: string;
  createdAt: string;
  updatedAt?: string;
};

// Get status icon and color
export const getStatusConfig = (status: string) => {
  switch (status) {
    case "pending":
      return {
        icon: <FaRegClock size={14} />,
        color: "text-yellow-600",
        bg: "bg-yellow-50 border-yellow-200",
      };
    case "ongoing":
      return {
        icon: <FiClock size={14} />,
        color: "text-blue-600",
        bg: "bg-blue-50 border-blue-200",
      };
    case "answered":
      return {
        icon: <FiCheckCircle size={14} />,
        color: "text-green-600",
        bg: "bg-green-50 border-green-200",
      };
    case "closed":
      return {
        icon: <FiAlertCircle size={14} />,
        color: "text-gray-600",
        bg: "bg-gray-50 border-gray-200",
      };
    default:
      return {
        icon: <FiAlertCircle size={14} />,
        color: "text-gray-600",
        bg: "bg-gray-50",
      };
  }
};

// Get priority color
export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-700";
    case "high":
      return "bg-orange-100 text-orange-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Issues = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [selectedIssue, setSelectedIssue] = useState<TIssue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isFetching } = useGetMyRaisedIssuesQuery({
    status: statusFilter,
    priority: priorityFilter,
  });
  const issues = data?.data?.data || [];
  console.log(data);
  const statsData = data?.data?.stats || [];

  // Statistics
  const stats = {
    total: statsData?.total || 0,
    pending: statsData?.pending || 0,
    ongoing: statsData?.ongoing || 0,
    resolved: statsData?.resolved || 0,
    closed: statsData?.closed || 0,
  };

  // Status options for filter pills
  const statusOptions = [
    {
      value: "",
      label: "All Issues",
      count: stats.total,
      icon: <FiGrid size={14} />,
    },
    {
      value: "pending",
      label: "Pending",
      count: stats.pending,
      icon: <FaRegClock size={14} />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      value: "ongoing",
      label: "Ongoing",
      count: stats.ongoing,
      icon: <FiClock size={14} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      value: "resolved",
      label: "Resolved",
      count: stats.resolved,
      icon: <FiCheckCircle size={14} />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      value: "Closed",
      label: "Closed",
      count: 0,
      icon: <FiAlertCircle size={14} />,
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
  ];

  // Priority options
  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-700" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-700" },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-700",
    },
    { value: "low", label: "Low", color: "bg-green-100 text-green-700" },
  ];

  return (
    <div className="space-y-6 font-Nunito">
      {/* Featured Question Card */}
      <div className="bg-gradient-primary rounded-2xl p-4 lg:p-6 mb-6 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <FiZap className="text-yellow-300" size={18} />
          <span className="text-sm font-medium text-yellow-200">
            Quick Actions
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Got any issue with your system?
        </h3>
        <p className="text-indigo-100 mb-4 text-sm lg:text-base">
          A comprehensive guide to integrate our API into your application...
        </p>
        <Link
          to="/dashboard/raise-issue"
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-fit"
        >
          Raise an Issue
          <MdKeyboardArrowRight />
        </Link>
      </div>

      {/* Modern Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
          {/* Status Filter Pills */}
          <div className="flex w-full overflow-x-auto text-nowrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 ${
                  statusFilter === option.value
                    ? "bg-primary-10 text-white shadow-md"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {option.icon}
                <span>{option.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    statusFilter === option.value
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {option.count}
                </span>
              </button>
            ))}
          </div>

          {/* Priority Filter Dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-10 bg-white"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Issues */}
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues?.map((issue: TIssue) => {
            return (
              <IssueCard
                key={issue._id}
                issue={issue}
                setSelectedIssue={setSelectedIssue}
                setIsModalOpen={setIsModalOpen}
              />
            );
          })}
        </div>
      )}

      {/* No Results */}
      {(!isLoading || !isFetching) &&issues?.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FiAlertCircle size={48} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No issues found
          </h3>
          <p className="text-gray-500">No issues match your selected filters</p>
        </div>
      )}

      {/* Issue Details Modal */}
      {isModalOpen && selectedIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 text-sm">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Issue Details
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="font-medium text-neutral-10">Title</label>
                <p className="text-gray-800 font-medium mt-1">
                  {selectedIssue.title}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="font-medium text-neutral-10">
                  Description
                </label>
                <p className="text-gray-700 mt-1">
                  {selectedIssue.description}
                </p>
              </div>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-neutral-10">Status</label>
                  <div
                    className={`w-fit flex items-center gap-2 px-3 py-1 rounded-full mt-2 ${getStatusConfig(selectedIssue.status).bg}`}
                  >
                    <span
                      className={getStatusConfig(selectedIssue.status).color}
                    >
                      {getStatusConfig(selectedIssue.status).icon}
                    </span>
                    <span
                      className={`font-medium capitalize ${getStatusConfig(selectedIssue.status).color}`}
                    >
                      {selectedIssue.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-medium text-neutral-10">
                    Priority
                  </label>
                  <div className="mt-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-lg font-medium capitalize ${getPriorityColor(selectedIssue.priority)}`}
                    >
                      {selectedIssue.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-neutral-10">
                    Created At
                  </label>
                  <p className="text-gray-800 mt-1">
                    {formatDate(selectedIssue.createdAt)}
                  </p>
                </div>
                {selectedIssue.resolvedAt && (
                  <div>
                    <label className="font-medium text-neutral-10">
                      Resolved At
                    </label>
                    <p className="text-green-600 mt-1 text-sm">
                      {formatDate(selectedIssue.resolvedAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Images */}
              {selectedIssue.images && selectedIssue.images.length > 0 && (
                <div>
                  <label className="font-medium text-neutral-10 mb-2 block">
                    Attachments
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {selectedIssue.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Attachment ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-neutral-30/20"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-2">
              <Button
                onClick={() => setIsModalOpen(false)}
                type="button"
                variant="secondary"
                label="Cancel"
              />
              <Button
                type="submit"
                variant="primary"
                label={"Mark as Closed"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issues;
