"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Displays logo, tagline, copyright
 * @returns {JSX.Element} – footer component
 */

export default function Footer() {
  return (
    <>
      {/* ===== Footer Layout ===== */}
      <footer className="px-6 sm:px-10 pb-6 sm:pb-10 pt-1.5">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-gray-200 pt-5"></div>
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-start gap-3">
              <Link href="/">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={70}
                  height={70}
                  priority
                />
              </Link>
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-base font-medium text-gray-700">
                  Random Acts of Kindness
                </span>
                <span className="text-sm font-medium text-gray-500">
                  A Journey to a Kinder World
                </span>
              </div>
            </div>

            <div className="mt-4 text-center lg:mt-0 lg:text-right">
              <p className="text-sm text-gray-500">
                An exam project by Nóra Vitkai.
              </p>
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
