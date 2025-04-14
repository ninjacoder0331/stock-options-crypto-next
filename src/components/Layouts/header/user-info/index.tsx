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
      <div className="fixed inset-0 z-[9999] flex h-[50vh] items-center justify-center">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)}></div>
        <div className="relative z-[10000] w-full max-w-md mx-4  transform rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <h2 className="mb-4 text-lg xs:text-xl font-semibold">Change Password</h2>
          <div>
            <div className="space-y-3 xs:space-y-4">
              <div>
                <label className="mb-2 block text-sm xs:text-base font-medium text-black dark:text-white">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full rounded border border-stroke bg-transparent px-4 xs:px-5 py-2.5 xs:py-3 text-sm xs:text-base outline-none focus:border-primary dark:border-dark-3"
                  value={currentPassword}
                  onChange={(e)=>setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm xs:text-base font-medium text-black dark:text-white">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full rounded border border-stroke bg-transparent px-4 xs:px-5 py-2.5 xs:py-3 text-sm xs:text-base outline-none focus:border-primary dark:border-dark-3"
                  value={newPassword}
                  onChange={(e)=>setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm xs:text-base font-medium text-black dark:text-white">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e)=>setConfirmPassword(e.target.value)}
                  className="w-full rounded border border-stroke bg-transparent px-4 xs:px-5 py-2.5 xs:py-3 text-sm xs:text-base outline-none focus:border-primary dark:border-dark-3"
                />
              </div>
              <div className="flex justify-end gap-3 xs:gap-4">
                <button
                  type="button"
                  onClick={() => {setShowPasswordModal(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }}
                  className="rounded bg-gray-2 px-4 xs:px-6 py-2 text-sm xs:text-base font-medium text-black hover:bg-gray-1 dark:bg-dark-3 dark:text-white dark:hover:bg-dark-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded bg-primary px-4 xs:px-6 py-2 text-sm xs:text-base font-medium text-white hover:bg-primary/90"
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
