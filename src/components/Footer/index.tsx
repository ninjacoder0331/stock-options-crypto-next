"use client";
import React from 'react';
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative z-10 bg-white py-3 dark:bg-gray-dark">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} Stock , options Trading
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
