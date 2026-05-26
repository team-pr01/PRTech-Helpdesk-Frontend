import { FiAlertCircle, FiHelpCircle } from "react-icons/fi";

export interface DashboardLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const navlinks: DashboardLink[] = [
  {
    label: "Queries",
    path: "/dashboard/queries",
    icon: <FiHelpCircle />,
  },
  {
    label: "Issues",
    path: "/dashboard/issues",
    icon: <FiAlertCircle />,
  },
];