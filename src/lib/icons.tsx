import * as React from "react";

export interface IconProps {
  className?: string;
  strokeWidth?: number;
}

function icon(
  displayName: string,
  defaultStrokeWidth: number,
  children: React.ReactNode,
  fill: string = "none",
) {
  const Icon = React.memo(({ className, strokeWidth = defaultStrokeWidth }: IconProps) => (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  ));
  Icon.displayName = displayName;
  return Icon;
}

export const ChevronDownIcon = icon("ChevronDownIcon", 2, <path d="m6 9 6 6 6-6" />);
export const ChevronUpIcon = icon("ChevronUpIcon", 2, <path d="m18 15-6-6-6 6" />);
export const ChevronLeftIcon = icon("ChevronLeftIcon", 2, <path d="m15 18-6-6 6-6" />);
export const ChevronRightIcon = icon("ChevronRightIcon", 2, <path d="m9 18 6-6-6-6" />);
export const ChevronsLeftIcon = icon("ChevronsLeftIcon", 2, <><path d="m11 17-5-5 5-5" /><path d="m18 17-5-5 5-5" /></>);
export const ChevronsRightIcon = icon("ChevronsRightIcon", 2, <><path d="m6 17 5-5-5-5" /><path d="m13 17 5-5-5-5" /></>);
export const ChevronsUpDownIcon = icon("ChevronsUpDownIcon", 2, <><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></>);

export const XIcon = icon("XIcon", 2, <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>);
export const CheckIcon = icon("CheckIcon", 2.5, <path d="M20 6 9 17l-5-5" />);
export const MinusIcon = icon("MinusIcon", 2.5, <path d="M5 12h14" />);
export const PlusIcon = icon("PlusIcon", 2, <><path d="M5 12h14" /><path d="M12 5v14" /></>);
export const SearchIcon = icon("SearchIcon", 2, <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>);
export const ExternalLinkIcon = icon("ExternalLinkIcon", 2, <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>);

export const EllipsisIcon = icon("EllipsisIcon", 2, <><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></>, "currentColor");
export const DotIcon = icon("DotIcon", 2, <circle cx="12" cy="12" r="5" />, "currentColor");
export const GripVerticalIcon = icon("GripVerticalIcon", 2, <><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></>, "currentColor");
export const GripHorizontalIcon = icon("GripHorizontalIcon", 2, <><circle cx="5" cy="9" r="1" /><circle cx="12" cy="9" r="1" /><circle cx="19" cy="9" r="1" /><circle cx="5" cy="15" r="1" /><circle cx="12" cy="15" r="1" /><circle cx="19" cy="15" r="1" /></>, "currentColor");

export const InboxIcon = icon("InboxIcon", 1, <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>);

export const InfoIcon = icon("InfoIcon", 2, <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>);
export const WarningIcon = icon("WarningIcon", 2, <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>);
export const ErrorIcon = icon("ErrorIcon", 2, <><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></>);
export const SuccessIcon = icon("SuccessIcon", 2, <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>);

export const CalendarIcon = icon("CalendarIcon", 2, <><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></>);
export const UserIcon = icon("UserIcon", 2, <><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></>);

export const PanelLeftIcon = icon("PanelLeftIcon", 2, <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></>);
export const PanelRightIcon = icon("PanelRightIcon", 2, <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M15 3v18" /></>);
