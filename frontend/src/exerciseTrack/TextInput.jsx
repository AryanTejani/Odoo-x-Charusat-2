// TextInput.jsx
import React, { useState, useRef, useEffect } from "react";
import { CloseRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import { gsap } from "gsap";

const TextInput = ({
  label,
  placeholder,
  name,
  value,
  error,
  handelChange,
  textArea,
  rows,
  columns,
  chipableInput,
  chipableArray,
  removeChip,
  height,
  small,
  popup,
  password,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      gsap.from(inputRef.current, {
        y: 5,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, []);

  return (
    <div className={`flex-1 flex flex-col gap-1.5 ${small ? 'text-xs' : ''}`} ref={inputRef}>
      <label 
        className={`
          text-xs px-1
          ${error ? 'text-red-500' : popup ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}
          ${small ? 'text-[8px]' : ''}
        `}
      >
        {label}
      </label>
      
      <div 
        className={`
          rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent
          ${small ? 'p-2 rounded-md' : 'p-4'}
          ${error ? 'border-red-500' : ''}
          ${popup ? 'text-gray-400 border-gray-400/60' : 'text-gray-700 dark:text-gray-300'}
          ${chipableInput ? 'flex flex-col items-start gap-2 bg-white dark:bg-gray-800' : 'flex items-center gap-3'}
          focus-within:border-blue-500
          ${chipableInput && height ? `min-h-[${height}]` : ''}
        `}
      >
        {chipableInput ? (
          <div className="flex flex-wrap gap-1.5">
            {chipableArray?.map((chip, index) => (
              <div 
                key={index}
                className="px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs flex items-center gap-1 cursor-pointer transition-all hover:bg-primary/20"
              >
                <span>{chip}</span>
                <CloseRounded
                  sx={{ fontSize: "14px" }}
                  onClick={() => removeChip(name, index)}
                  className="cursor-pointer"
                />
              </div>
            ))}
            {textArea ? (
              <textarea
                className="w-full text-sm outline-none border-none bg-transparent resize-none text-gray-700 dark:text-gray-300"
                name={name}
                rows={rows}
                columns={columns}
                placeholder={placeholder}
                value={value}
                onChange={(e) => handelChange(e)}
              />
            ) : (
              <input
                className={`
                  w-full outline-none border-none bg-transparent
                  ${small ? 'text-xs' : 'text-sm'}
                  ${popup ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}
                `}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={(e) => handelChange(e)}
              />
            )}
          </div>
        ) : (
          <>
            {textArea ? (
              <textarea
                className={`
                  w-full outline-none border-none bg-transparent resize-none
                  ${small ? 'text-xs' : 'text-sm'}
                  ${popup ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}
                `}
                name={name}
                rows={rows}
                columns={columns}
                placeholder={placeholder}
                value={value}
                onChange={(e) => handelChange(e)}
              />
            ) : (
              <input
                className={`
                  w-full outline-none border-none bg-transparent
                  ${small ? 'text-xs' : 'text-sm'}
                  ${popup ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}
                `}
                name={name}
                type={password && !showPassword ? "password" : "text"}
                placeholder={placeholder}
                value={value}
                onChange={(e) => handelChange(e)}
              />
            )}
            {password && (
              <div className="cursor-pointer text-gray-500">
                {showPassword ? (
                  <Visibility onClick={() => setShowPassword(false)} />
                ) : (
                  <VisibilityOff onClick={() => setShowPassword(true)} />
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {error && (
        <p className={`text-xs mx-1 text-red-500 ${small ? 'text-[8px]' : ''}`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;
