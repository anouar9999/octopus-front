import React from "react";
import Icon from "@/components/ui/Icon";
import Link from "next/link";

const Button = ({
  text,
  type = "button",
  isLoading = false,
  disabled = false,
  className = "bg-primary-500 text-white",
  children,
  icon,
  loadingClass = "text-white",
  iconPosition = "left",
  iconClass = "text-[20px]",
  link,
  onClick,
  div,
  ...rest
}) => {
  const buttonContent = (
    <>
      {!isLoading && children}
      {!isLoading && !children && (
        <span className="flex items-center">
          {icon && iconPosition === "left" && (
            <Icon icon={icon} className={`mr-2 ${iconClass}`} />
          )}
          <span>{text}</span>
          {icon && iconPosition === "right" && (
            <Icon icon={icon} className={`ml-2 ${iconClass}`} />
          )}
        </span>
      )}
      {isLoading && (
        <span className="flex items-center">
          <svg
            className={`animate-spin -ml-1 mr-3 h-5 w-5 ${loadingClass}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      )}
    </>
  );

  const buttonClasses = `
    btn inline-flex items-center justify-center
    ${isLoading ? "pointer-events-none" : ""}
    ${disabled ? "opacity-40 cursor-not-allowed" : ""}
    ${className}
  `;

  if (link) {
    return (
      <Link href={link} className={buttonClasses} {...rest}>
        {buttonContent}
      </Link>
    );
  }

  if (div) {
    return (
      <div onClick={disabled ? undefined : onClick} className={buttonClasses} {...rest}>
        {buttonContent}
      </div>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonClasses}
      {...rest}
    >
      {buttonContent}
    </button>
  );
};

export default Button;