import { useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiImage,
  FiCalendar,
  FiActivity,
  FiGrid,
} from "react-icons/fi";
import { FaBug, FaRegClock } from "react-icons/fa";
import { formatDate } from "../../../utils/formatDate";
import { Link } from "react-router-dom";
import Button from "../../../components/Reusable/Button/Button";

// Types
type TIssue = {
  _id: string;
  title: string;
  description: string;
  status: "Pending" | "Ongoing" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  category: string;
  images?: string[];
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
};

// Mock data for demonstration
const mockIssues: TIssue[] = [
  {
    _id: "1",
    title: "Login page not loading",
    description:
      "Users are unable to access the login page. Getting a 500 error.",
    status: "Pending",
    priority: "High",
    category: "Bug",
    images: ["https://via.placeholder.com/100"],
    createdAt: "2026-05-25T10:00:00Z",
  },
  {
    _id: "2",
    title: "Dashboard data not showing",
    description:
      "The dashboard is not displaying the latest data. Charts are empty.",
    status: "Ongoing",
    priority: "Urgent",
    category: "Bug",
    images: [],
    createdAt: "2026-05-24T14:30:00Z",
    resolvedAt: "2026-05-25T09:00:00Z",
    resolution: "Fixed the API endpoint issue",
  },
  {
    _id: "3",
    title: "Mobile responsive issue",
    description: "The website is not displaying correctly on mobile devices.",
    status: "Resolved",
    priority: "Medium",
    category: "UI/UX",
    images: ["https://via.placeholder.com/100"],
    createdAt: "2026-05-23T09:15:00Z",
    resolution: "Fixed with CSS media queries",
  },
  {
    _id: "4",
    title: "Payment gateway timeout",
    description:
      "Users are experiencing timeout issues during payment processing.",
    status: "Ongoing",
    priority: "Urgent",
    category: "Payment",
    images: [],
    createdAt: "2026-05-26T08:00:00Z",
  },
  {
    _id: "5",
    title: "Email notification not sending",
    description:
      "System is not sending email notifications for order confirmations.",
    status: "Pending",
    priority: "High",
    category: "Notification",
    images: [],
    createdAt: "2026-05-25T16:20:00Z",
  },
  {
    _id: "6",
    title: "Search functionality broken",
    description:
      "Search bar is not returning correct results for product queries.",
    status: "Resolved",
    priority: "Medium",
    category: "Feature",
    images: ["https://via.placeholder.com/100"],
    createdAt: "2026-05-22T11:00:00Z",
    resolvedAt: "2026-05-24T15:30:00Z",
    resolution: "Fixed indexing issue in search algorithm",
  },
];

const Issues = () => {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [selectedIssue, setSelectedIssue] = useState<TIssue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Statistics
  const stats = {
    total: mockIssues.length,
    pending: mockIssues.filter((i) => i.status === "Pending").length,
    ongoing: mockIssues.filter((i) => i.status === "Ongoing").length,
    resolved: mockIssues.filter((i) => i.status === "Resolved").length,
    urgent: mockIssues.filter((i) => i.priority === "Urgent").length,
  };

  // Status options for filter pills
  const statusOptions = [
    {
      value: "All",
      label: "All Issues",
      count: stats.total,
      icon: <FiGrid size={14} />,
    },
    {
      value: "Pending",
      label: "Pending",
      count: stats.pending,
      icon: <FaRegClock size={14} />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      value: "Ongoing",
      label: "Ongoing",
      count: stats.ongoing,
      icon: <FiClock size={14} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      value: "Resolved",
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
    { value: "All", label: "All Priorities" },
    { value: "Urgent", label: "Urgent", color: "bg-red-100 text-red-700" },
    { value: "High", label: "High", color: "bg-orange-100 text-orange-700" },
    {
      value: "Medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-700",
    },
    { value: "Low", label: "Low", color: "bg-green-100 text-green-700" },
  ];

  // Filter issues
  const filteredIssues = mockIssues.filter((issue) => {
    if (statusFilter !== "All" && issue.status !== statusFilter) return false;
    if (priorityFilter !== "All" && issue.priority !== priorityFilter)
      return false;
    return true;
  });

  // Get status icon and color
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          icon: <FaRegClock size={14} />,
          color: "text-yellow-600",
          bg: "bg-yellow-50 border-yellow-200",
        };
      case "Ongoing":
        return {
          icon: <FiClock size={14} />,
          color: "text-blue-600",
          bg: "bg-blue-50 border-blue-200",
        };
      case "Resolved":
        return {
          icon: <FiCheckCircle size={14} />,
          color: "text-green-600",
          bg: "bg-green-50 border-green-200",
        };
      case "Closed":
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
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-700";
      case "High":
        return "bg-orange-100 text-orange-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleViewDetails = (issue: TIssue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 font-Nunito">
      {/* Premium Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-primary rounded-2xl shadow-lg">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-accent-10/20 rounded-full"></div>

        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <FaBug size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Issue Tracker
                  </h1>
                  <p className="text-white/80 mt-1">
                    Track, manage, and resolve issues efficiently
                  </p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex gap-4 mt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-white/70 text-xs">Total Issues</p>
                  <p className="text-white text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-white/70 text-xs">Pending</p>
                  <p className="text-white text-2xl font-bold">
                    {stats.pending}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-white/70 text-xs">Ongoing</p>
                  <p className="text-white text-2xl font-bold">
                    {stats.ongoing}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-white/70 text-xs">Resolved</p>
                  <p className="text-white text-2xl font-bold">
                    {stats.resolved}
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/dashboard/raise-issue"
              className="bg-white text-primary-10 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <FiActivity size={18} />
              Report New Issue
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIssues.map((issue) => {
          const statusConfig = getStatusConfig(issue.status);
          return (
            <div
              key={issue._id}
              className={`p-5 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer`}
              onClick={() => handleViewDetails(issue)}
            >
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {issue.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4">{issue.description}</p>

              <div className="flex items-center gap-2 mb-4">
                {/* Status Badge */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${statusConfig.bg}`}
                >
                  <span className={statusConfig.color}>
                    {statusConfig.icon}
                  </span>
                  <span className={`font-medium ${statusConfig.color}`}>
                    {issue.status}
                  </span>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}
                >
                  {issue.priority}
                </span>
              </div>

              {/* Meta Information */}
              <div className="space-y-2 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiCalendar size={14} />
                  <span>Reported: {formatDate(issue.createdAt)}</span>
                </div>

                {issue.resolvedAt && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FiCheckCircle size={14} />
                    <span>Resolved: {formatDate(issue.resolvedAt)}</span>
                  </div>
                )}

                {/* Images Preview */}
                {issue.images && issue.images.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-primary-10">
                    <FiImage size={14} />
                    <span>{issue.images.length} attachment(s)</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredIssues.length === 0 && (
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
                      className={`font-medium ${getStatusConfig(selectedIssue.status).color}`}
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
                      className={`inline-block px-3 py-1 rounded-lg font-medium ${getPriorityColor(selectedIssue.priority)}`}
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

              {/* Resolution */}
              {selectedIssue.resolution && (
                <div>
                  <label className="font-medium text-neutral-10">
                    Feedback
                  </label>
                  <p className="text-gray-700 bg-green-50 p-3 rounded-lg mt-1 text-sm">
                    {selectedIssue.resolution}
                  </p>
                </div>
              )}

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
