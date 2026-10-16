import React from "react";
import { CircleCheck, CircleX } from "lucide-react";

interface DispoVerdictIconProps {
  suffisant: boolean;
}

const DispoVerdictIcon: React.FC<DispoVerdictIconProps> = ({ suffisant }) =>
  suffisant ? (
    <span
      className='inline-flex items-center justify-center size-7 rounded-full bg-teal-50 text-teal-600'
      title='Stock suffisant'
    >
      <CircleCheck className='w-5 h-5' />
    </span>
  ) : (
    <span
      className='inline-flex items-center justify-center size-7 rounded-full bg-red-50 text-red-600'
      title='Stock insuffisant'
    >
      <CircleX className='w-5 h-5' />
    </span>
  );

export default DispoVerdictIcon;