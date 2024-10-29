"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface CategoryItemProps {
  label: string;
  value: string;
  isSelected: boolean;
}

export const CategoryItem = ({
  label,
  value,
  isSelected,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTitle = searchParams.get("title");

  const handleClick = useCallback(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? undefined : value,
        },
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  }, [pathname, currentTitle, isSelected, value, router]);

  return (
    <button
      className={cn(
        "py-2 px-3 text-sm border border-slate-200 rounded-md flex items-center gap-x-1 hover:border-sky-700 transition",
        {
          "border-sky-700 bg-sky-100 text-sky-700": isSelected,
        },
      )}
      onClick={handleClick}
      aria-pressed={isSelected}
    >
      <div className="truncate">{label}</div>
    </button>
  );
};
