/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiCalendar, FiCheckCircle, FiFile, FiImage } from "react-icons/fi";
import {
  getPriorityColor,
  getStatusConfig,
  type TIssue,
} from "../../../pages/Dashboard/Issues/Issues";
import { formatDate } from "../../../utils/formatDate";

const IssueCard = ({ issue, setSelectedIssue, setIsModalOpen }: any) => {
  const handleViewDetails = (issue: TIssue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const statusConfig = getStatusConfig(issue.status);
  return (
    <div
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
          <span className={statusConfig.color}>{statusConfig.icon}</span>
          <span className={`font-medium capitalize ${statusConfig.color}`}>
            {issue.status}
          </span>
        </div>

        <span
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(issue.priority)}`}
        >
          {issue.priority}
        </span>
      </div>

      {/* Meta Information */}
      <div className="space-y-2 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiFile size={14} />
          <p>
            Project: <span className="font-bold">{issue?.project?.name}</span>
          </p>
        </div>
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
};

export default IssueCard;
