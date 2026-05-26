/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FiCheckCircle, FiMessageSquare } from "react-icons/fi";
import { MdOutlineForum } from "react-icons/md";
import Button from "../../../components/Reusable/Button/Button";
import { Link } from "react-router-dom";
import QueryCard from "../../../components/QueryPage/QueryCard/QueryCard";
import { useGetMyQueriesQuery } from "../../../redux/Features/queries/queriesApi";
import Loader from "../../../components/Reusable/Loader/Loader";

// Types
export type TQuery = {
  _id: string;
  subject: string;
  description: string;
  status: "pending" | "answered" | "closed";
  priority: "low" | "medium" | "high";
  queryType: string;
  answeredAt?: string;
  answer?: string;
  raisedBy: string;
  createdAt: string;
  updatedAt: string;
};

const Queries = () => {
  const [activeTab, setActiveTab] = useState<
    "" | "pending" | "answered" | "closed"
  >("");

  const { data, isLoading, isFetching } = useGetMyQueriesQuery({
    status: activeTab,
  });
  const queries = data?.data?.data || [];
  const tabs = [
    {
      id: "",
      label: "All",
      icon: <FiCheckCircle size={16} />,
    },
    {
      id: "pending",
      label: "Pending",
      icon: <FiMessageSquare size={16} />,
    },
    {
      id: "answered",
      label: "Answered",
      icon: <FiCheckCircle size={16} />,
    },
  ];

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
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <div className="space-y-4">
          {queries?.map((query: TQuery) => (
            <QueryCard key={query._id} query={query} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Queries;
