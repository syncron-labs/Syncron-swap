import clsx from "clsx";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const AlertWithLink = ({
  href,
  onClick,
  title,
  description,
  className,
}: {
  href: string;
  onClick?: () => void;
  title: string;
  description: string;
  className?: string;
}) => {
  const alertClasses = clsx(
    "flex",
    "flex-row",
    "items-center",
    "space-x-5",
    `w-[400px]`,
    "justify-between",
    "bg-blue-500/20",
    "text-blue-500",
    "font-bold",
    "text-2xl",
    "p-5",
    "rounded-lg",
    className, // Allow external classes to be passed
  );

  return (
    <Link href={href} onClick={onClick} className={alertClasses}>
      <div>
        <h2 className="flex flex-col text-base items-center justify-center text-center space-y-3 truncate ">
          {title}
        </h2>
        <p className="text-sm">{description}</p>
      </div>
      <ArrowBigRight className="" />
    </Link>
  );
};

export default AlertWithLink;
