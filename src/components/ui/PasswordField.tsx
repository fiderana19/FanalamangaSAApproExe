import React, { useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordFieldProps {
  id: string;
  label: string;
  error?: string;
  value?: string;
  onChange: (...event: unknown[]) => void;
  onBlur: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  error,
  value,
  onChange,
  onBlur,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <div>
      <Label htmlFor={id} className='mb-1 block text-[13px] font-semibold'>
        {label}
      </Label>
      <div className='relative'>
        <Input
          id={id}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`${error && 'border-red-500 text-red-500'} border-[#d9dee5] pr-10`}
        />
        {isVisible ? (
          <EyeInvisibleOutlined
            onClick={() => setIsVisible(false)}
            className='absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer text-gray-500'
          />
        ) : (
          <EyeOutlined
            onClick={() => setIsVisible(true)}
            className='absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer text-gray-500'
          />
        )}
      </div>
      {error && (
        <div className='text-xs text-red-500 w-full mt-1'>{error}</div>
      )}
    </div>
  );
};

export default PasswordField;