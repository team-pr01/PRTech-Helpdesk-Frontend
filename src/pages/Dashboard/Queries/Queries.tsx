/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  FiMessageCircle,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiSend,
  FiThumbsUp,
  FiMessageSquare,
} from "react-icons/fi";
import { MdOutlineForum, MdOutlineQuestionAnswer } from "react-icons/md";
import { formatDate } from "../../../utils/formatDate";
import Button from "../../../components/Reusable/Button/Button";

// Types
type TQuery = {
  _id: string;
  title: string;
  description: string;
  status: "Pending" | "Answered" | "Closed";
  priority: "Low" | "Medium" | "High";
  category: string;
  createdAt: string;
  answeredAt?: string;
  answer?: string;
  askedBy: {
    name: string;
    email: string;
  };
  helpful?: number;
};

// Mock data
const mockQueries: TQuery[] = [
  {
    _id: "1",
    title: "How to integrate payment gateway?",
    description:
      "I'm trying to integrate Stripe payment gateway but facing issues with webhook configuration.",
    status: "Answered",
    priority: "High",
    category: "Integration",
    createdAt: "2026-05-25T10:00:00Z",
    answeredAt: "2026-05-26T09:00:00Z",
    answer:
      "You need to configure the webhook endpoint in your Stripe dashboard. Here's a step-by-step guide...",
    askedBy: { name: "John Doe", email: "john@example.com" },
    helpful: 12,
  },
  {
    _id: "2",
    title: "API rate limiting explanation",
    description:
      "Can you explain how the API rate limiting works? What are the limits per minute?",
    status: "Answered",
    priority: "Medium",
    category: "API",
    createdAt: "2026-05-24T14:30:00Z",
    answeredAt: "2026-05-25T11:00:00Z",
    answer: "Our API allows 100 requests per minute per API key.",
    askedBy: { name: "Jane Smith", email: "jane@example.com" },
    helpful: 8,
  },
  {
    _id: "3",
    title: "Dashboard not showing latest data",
    description: "The dashboard is showing outdated data.",
    status: "Pending",
    priority: "High",
    category: "Bug",
    createdAt: "2026-05-26T08:00:00Z",
    askedBy: { name: "Alice Johnson", email: "alice@example.com" },
  },
];

const Queries = () => {
  const [activeTab, setActiveTab] = useState<"all" | "unanswered" | "answered">(
    "all",
  );
  const [selectedQuery, setSelectedQuery] = useState<TQuery | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter queries
  const filteredQueries = mockQueries.filter((query) => {
    if (activeTab === "unanswered" && query.status !== "Pending") return false;
    if (activeTab === "answered" && query.status !== "Answered") return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    if (status === "Answered") {
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
      High: "bg-red-100 text-red-700 border-red-200",
      Medium: "bg-orange-100 text-orange-700 border-orange-200",
      Low: "bg-green-100 text-green-700 border-green-200",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[priority as keyof typeof colors]}`}
      >
        {priority}
      </span>
    );
  };

  return (
    <div className="">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-primary p-2 rounded-xl shadow-lg">
          <MdOutlineForum className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary-10">
            Queries
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Ask questions, get answers, and learn from the community
          </p>
        </div>
      </div>
      {/* Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-sm">
          {[
            {
              id: "all",
              label: "All Questions",
              icon: <MdOutlineQuestionAnswer size={16} />,
            },
            {
              id: "unanswered",
              label: "Unanswered",
              icon: <FiMessageSquare size={16} />,
            },
            {
              id: "answered",
              label: "Answered",
              icon: <FiCheckCircle size={16} />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary-10 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <Button label="Raise a Query" />
      </div>

      {/* Q&A Cards - Forum Style */}
      <div className="space-y-4">
        {filteredQueries.map((query) => (
          <div
            key={query._id}
            onClick={() => {
              setSelectedQuery(query);
              setIsModalOpen(true);
            }}
            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border-l-2 border-l-primary-10 hover:translate-x-1"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              {/* Middle - Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                    {query.title}
                  </h3>
                  {getPriorityBadge(query.priority)}
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
                    {query.category}
                  </span>
                </div>
              </div>

              {/* Right side - Status */}
              <div className="text-right">
                {getStatusBadge(query.status)}
                {query.answeredAt && (
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDate(query.answeredAt)}
                  </div>
                )}
              </div>
            </div>

            {/* Answer Preview if answered */}
            {query.status === "Answered" && query.answer && (
              <div className="mt-3 pl-3 border-l-2 border-indigo-200">
                <div className="flex items-center gap-2 text-xs text-indigo-600 mb-1">
                  <FiThumbsUp size={12} />
                  <span>Answer</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {query.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for Answer */}
      {isModalOpen && selectedQuery && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">
                    {selectedQuery.askedBy.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedQuery.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Asked by {selectedQuery.askedBy.name} •{" "}
                    {formatDate(selectedQuery.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Question
                </h4>
                <p className="text-gray-800">{selectedQuery.description}</p>
              </div>

              {selectedQuery.answer && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-3">
                    <FiThumbsUp className="text-indigo-600" size={16} />
                    <h4 className="font-semibold text-indigo-800">Answer</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedQuery.answer}
                  </p>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-indigo-100">
                    <button className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700">
                      <FiThumbsUp size={14} /> Helpful ({selectedQuery.helpful})
                    </button>
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-600">
                      <FiMessageCircle size={14} /> Reply
                    </button>
                  </div>
                </div>
              )}

              {!selectedQuery.answer && (
                <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100 text-center">
                  <FiClock className="mx-auto text-yellow-500 mb-2" size={32} />
                  <p className="text-yellow-700">
                    Waiting for an answer from our team
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">
                    You'll be notified once someone answers
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment or follow-up question..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button className="bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition flex items-center gap-2">
                  <FiSend size={16} /> Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Queries;
