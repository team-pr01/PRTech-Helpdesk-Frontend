import { FiCalendar, FiCheckCircle, FiClock, FiThumbsUp } from "react-icons/fi";
import type { TQuery } from "../../../pages/Dashboard/Queries/Queries";
import { formatDate } from "../../../utils/formatDate";
import { useState } from "react";

const QueryCard = ({ query }: { query: TQuery }) => {
  const [expandedQueryId, setExpandedQueryId] = useState<string | null>(null);
  const getStatusBadge = (status: string) => {
    if (status === "answered") {
      return (
        <div className="flex items-center gap-1 text-green-600 text-sm">
          <FiCheckCircle size={14} /> Answered
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-yellow-600 text-sm">
        <FiClock size={14} /> Awaiting Response
      </div>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-700 border-red-200",
      medium: "bg-orange-100 text-orange-700 border-orange-200",
      low: "bg-green-100 text-green-700 border-green-200",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium border h-fit mt-1.5 capitalize ${colors[priority as keyof typeof colors]}`}
      >
        {priority}
      </span>
    );
  };
  return (
    <div
      key={query._id}
      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border-l-2 border-l-primary-10 hover:translate-x-1"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Middle - Content */}
        <div className="flex-1">
          <div className="flex gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-800 hover:text-primary-10 transition-colors">
              {query?.subject}
            </h3>
            {getPriorityBadge(query?.priority)}
          </div>

          {/* Status - For Mobile*/}
          <div className="flex items-center gap-2 md:hidden mb-3">
            {getStatusBadge(query.status)}
            {query.answeredAt && (
              <div className="text-xs text-gray-400">
                {formatDate(query.answeredAt)}
              </div>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {query.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <FiCalendar size={12} />
              {formatDate(query.createdAt)}
            </span>
            <span className="capitalize px-2 py-0.5 rounded-full bg-gray-100">
              {query.queryType}
            </span>
          </div>
        </div>

        {/* Right side - Status */}
        <div className="text-right hidden md:block">
          {getStatusBadge(query.status)}
          {query.answeredAt && (
            <div className="text-xs text-gray-400 mt-1">
              {formatDate(query.answeredAt)}
            </div>
          )}
        </div>
      </div>

      {/* Answer Preview if answered */}
      {query.status === "answered" && query.answer && (
        <div className="mt-3 pl-3 border-l-2 border-indigo-200">
          <div className="flex items-center gap-2 text-xs text-primary-10 mb-1">
            <FiThumbsUp size={12} />
            <span>Answer</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-gray-600 inline">
              {expandedQueryId === query._id
                ? query.answer
                : query.answer.length > 100
                  ? `${query.answer.slice(0, 100)}`
                  : query.answer}
            </p>
            {query.answer.length > 100 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedQueryId(
                    expandedQueryId === query._id ? null : query._id,
                  );
                }}
                className="text-xs text-primary-10 hover:underline font-medium whitespace-nowrap inline"
              >
                {expandedQueryId === query._id ? "See less" : "... See more"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryCard;
