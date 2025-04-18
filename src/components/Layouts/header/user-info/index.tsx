"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { useAuth } from "@/providers/AuthProvider";
import cookie from "js-cookie";
import { toast } from "react-toastify";
import apiClient from "@/lib/axios";


export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { signout } = useAuth();
  const USER = {
    name: "Daniel",
    email: cookie.get("email"),
    img: "/images/user/user-03.png",
  };

  const changePassword = () => {
    console.log("changePassword");
    if (currentPassword === "" || newPassword === "" || confirmPassword === "") {
      toast.error("Please enter all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password cannot be the same as the current password");
      return;
    }

    const payload = {
      email : cookie.get("email"),
      currentPassword: currentPassword,
      newPassword: newPassword,
    }

    const response = apiClient.post("/api/auth/changePassword", payload).then((res) => {
      if (res.status === 200) {
        toast.success("Password changed successfully");
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
      else {
        toast.error("Password change failed");
      }
    });
  };


  return (
    <>
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded-full align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark transition-all duration-200 hover:opacity-90">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <Image
              src={USER.img}
              className="size-8 xs:size-10 sm:size-12 rounded-full object-cover ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40"
              alt={`Avatar of ${USER.name}`}
              role="presentation"
              width={200}
              height={200}
            />
            <div className="absolute bottom-0 right-0 size-2 xs:size-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-dark" />
          </div>
          <figcaption className="flex items-center gap-1.5 font-medium dark:text-white text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span className="text-xs xs:text-sm sm:text-base">{USER.name}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "size-3 xs:size-4 rotate-180 transition-transform duration-200",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-gray-800 w-[calc(100vw-2rem)] xs:w-[17.5rem] rounded-xl overflow-hidden"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-3 px-4 xs:px-5 py-3 xs:py-4">
          <div className="relative">
            <Image
              src={USER.img}
              className="size-10 xs:size-12 rounded-full object-cover ring-2 ring-primary/20"
              alt={`Avatar for ${USER.name}`}
              role="presentation"
              width={200}
              height={200}
            />
            <div className="absolute bottom-0 right-0 size-2 xs:size-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-dark" />
          </div>

          <figcaption className="space-y-0.5 xs:space-y-1 min-w-0">
            <div className="text-sm xs:text-base font-semibold leading-none text-dark dark:text-white truncate">
              {USER.name}
            </div>

            <div className="text-xs xs:text-sm leading-none text-gray-6 dark:text-gray-400 truncate">
              {USER.email}
            </div>
          </figcaption>
        </figure>

        <hr className="border-stroke/50 dark:border-dark-3/50" />

        <div className="p-1.5 xs:p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <div
            onClick={() => {
              setShowPasswordModal(true);
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 xs:gap-2.5 rounded-lg px-2.5 xs:px-3 py-2 xs:py-2.5 transition-colors duration-200 hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon className="size-4 xs:size-5" />
            <span className="mr-auto text-xs xs:text-sm font-medium">
              Change Password
            </span>
          </div>

         

        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2 xs:gap-2.5 rounded-lg px-2.5 xs:px-3 py-2 xs:py-2.5 transition-colors duration-200 hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={signout}
          >
            <LogOutIcon className="size-4 xs:size-5" />
            <span className="text-xs xs:text-sm font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
    
     {showPasswordModal && (
      <div className="fixed inset-0 z-[9999] h-[50vh] flex items-center justify-center">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={() => setShowPasswordModal(false)}></div>
        <div className="relative z-[10000] w-full max-w-md mx-4 transform rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800 animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
            <button 
              onClick={() => setShowPasswordModal(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={currentPassword}
                  onChange={(e)=>setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={newPassword}
                  onChange={(e)=>setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e)=>setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {setShowPasswordModal(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                  onClick={()=>changePassword()}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
