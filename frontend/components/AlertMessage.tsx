import { Alert, AlertTitle } from "./ui/alert";
import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const AlertMessage = ({
  message,
  type,
}: {
  message: string;
  type: "error" | "success";
}) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle />;
      case "error":
        return <FaExclamationTriangle />;
      default:
        return <FaInfoCircle />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <Alert
      className={`rounded-md shadow-md border-0 ${getBackgroundColor()} text-white`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 text-xl w-[44px] h-[44px] flex justify-center items-center bg-white bg-opacity-20 rounded-full">
          {getIcon()}
        </div>
        <AlertTitle
          style={{ color: "white" }}
          className="flex-1 text-base leading-relaxed font-medium break-words"
        >
          {message}
        </AlertTitle>
      </div>
    </Alert>
  );
};

export default AlertMessage;
