"use client";

import { useAppDispatch } from "@/app/reduxStoreProvider";
import { setLoading } from "@/state/loadingSlice";
import { LucideIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  key?: string | number | undefined;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    setIsLoading(true);
    startTransition(() => {
      router.push(href);
      setIsLoading(false);
    });
  };

  return (
    <Link href={href}>
      {/* <div className="w-full cursor-pointer" onClick={handleClick}> */}
      <div className="relative flex items-center gap-3 px-8 py-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700">
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin text-gray-800 dark:text-gray-100" />
        ) : (
          <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        )}
        <span className="font-medium text-gray-800 dark:text-gray-100">
          {label}
        </span>
        {/* </div> */}
      </div>
    </Link>
  );
};

export default SidebarLink;
