import { Clock } from "lucide-react";

interface BusinessHoursProps {
  hours: string[];
}

const BusinessHours = ({ hours }: BusinessHoursProps) => {
  if (!hours || hours.length === 0) return null;

  return (
    <div className="text-sm">
      <Clock className="inline-block h-4 w-4 mr-2" />
      <span className="font-medium">Opening Hours:</span>
      <ul className="ml-6 mt-1">
        {hours.map((hour: string, index: number) => (
          <li key={index}>{hour}</li>
        ))}
      </ul>
    </div>
  );
};

export default BusinessHours;