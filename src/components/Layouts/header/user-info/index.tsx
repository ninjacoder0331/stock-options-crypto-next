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

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { signout } = useAuth();
  const USER = {
    name: "Daniel",
    email: "johnson@nextadmin.com",
    img: "/images/user/user-03.png",
  };
  

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <Image
            src={USER.img}
            className="size-12"
            alt={`Avatar of ${USER.name}`}
            role="presentation"
            width={200}
            height={200}
          />
          <figcaption className="flex items-center gap-1 font-medium dark:text-white text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{USER.name}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={USER.img}
            className="size-12"
            alt={`Avatar for ${USER.name}`}
            role="presentation"
            width={200}
            height={200}
          />

          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {USER.name}
            </div>

            <div className="leading-none text-gray-6">{USER.email}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>

          <Link
            href={"/pages/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>

          <div
            onClick={() => {
              // setIsOpen(false);
              setShowPasswordModal(true);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />
            <span className="mr-auto text-base font-medium">
              Change Password
            </span>
          </div>

          {showPasswordModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-dark">
                <h2 className="mb-4 text-xl font-semibold">Change Password</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Add your password change logic here
                  setShowPasswordModal(false);
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full rounded border border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-dark-3"
                      />
                    </div>
                    <div>
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full rounded border border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-dark-3"
                      />
                    </div>
                    <div>
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full rounded border border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-dark-3"
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setShowPasswordModal(false)}
                        className="rounded bg-gray-2 px-6 py-2 text-base font-medium text-black hover:bg-gray-1 dark:bg-dark-3 dark:text-white dark:hover:bg-dark-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded bg-primary px-6 py-2 text-base font-medium text-white hover:bg-primary/90"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={signout}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
