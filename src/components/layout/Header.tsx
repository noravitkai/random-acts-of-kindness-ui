"use client";

import React from "react";

interface PageHeaderProps {
  title: React.ReactNode;
  description: string;
  buttons: {
    label: React.ReactNode;
    onClick: () => void;
    primary?: boolean;
  }[];
}

/**
 * Page header with heading, paragraph, and buttons of navigation
 * @param {PageHeaderProps} props – includes title, description, and buttons
 * @returns {JSX.Element} – header component
 */
const Header: React.FC<PageHeaderProps> = ({ title, description, buttons }) => {
  return (
    <>
      {/* ===== Header Layout ===== */}
      <div className="border-b border-gray-200 pb-7 mb-6 sm:mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 max-w-2xl text-base text-gray-600">
            {description}
          </p>
        </div>
        <div className="flex gap-4 mt-4 lg:mt-0">
          {buttons.map((button, index) => (
            <div key={index} className="relative group inline-block">
              <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border-2 border-dashed border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
              <button
                onClick={button.onClick}
                className={`relative z-10 rounded-md border-2 border-black px-4 py-2 text-sm font-semibold transition duration-300 cursor-pointer flex items-center gap-2 ${
                  button.primary
                    ? "bg-primary text-background hover:bg-secondary"
                    : "bg-background text-gray-900 hover:bg-secondary hover:text-background"
                }`}
              >
                {button.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
