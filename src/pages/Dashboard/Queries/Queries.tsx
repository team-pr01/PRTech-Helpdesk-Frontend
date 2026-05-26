/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FiCheckCircle, FiMessageSquare } from "react-icons/fi";
import { MdOutlineForum } from "react-icons/md";
import Button from "../../../components/Reusable/Button/Button";
import { Link } from "react-router-dom";
import QueryCard from "../../../components/QueryPage/QueryCard/QueryCard";

// Types
export type TQuery = {
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
      "You need to configure the webhook endpoint in your Stripe dashboard. Here's a step-by-step guide.You need to configure the webhook endpoint in your Stripe dashboard. Here's a step-by-step guide.You need to configure the webhook endpoint in your Stripe dashboard. Here's a step-by-step guide.",
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
  const tabs = [
    {
      id: "all",
      label: "All",
      icon: <FiCheckCircle size={16} />,
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
  ];
  const [activeTab, setActiveTab] = useState<"all" | "unanswered" | "answered">(
    "all",
  );

  // Filter queries
  const filteredQueries = mockQueries.filter((query) => {
    if (activeTab === "unanswered" && query.status !== "Pending") return false;
    if (activeTab === "answered" && query.status !== "Answered") return false;
    return true;
  });

  return (
    <div className="">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-primary p-2 rounded-xl shadow-lg">
          <MdOutlineForum className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary-10">Queries</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Ask questions, get answers, and learn from the community
          </p>
        </div>
      </div>
      {/* Tabs & Button */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex gap-2 bg-white/80 backdrop-blur-sm p-1 rounded-lg md:rounded-xl shadow-sm w-fit overflow-x-auto text-nowrap">
          {tabs?.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded md:rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
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

        <Link to="/dashboard/raise-query">
          {" "}
          <Button label="Raise a Query" />
        </Link>
      </div>

      {/* Q&A Cards - Forum Style */}
      <div className="space-y-4">
        {filteredQueries.map((query) => (
          <QueryCard key={query._id} query={query} />
        ))}
      </div>
    </div>
  );
};

export default Queries;
