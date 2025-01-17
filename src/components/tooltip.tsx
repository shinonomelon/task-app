import { ReactNode } from 'react';

type TooltipProps = {
  label: string;
  children: ReactNode;
};

export const Tooltip = ({ label, children }: TooltipProps) => {
  return (
    <div className="group relative inline-block">
      <span className="pointer-events-none absolute -top-10 left-1/2 min-w-[80vw] -translate-x-1/2  rounded bg-orange-300 p-1 text-xs text-white opacity-0 transition before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-orange-300 before:content-[''] group-hover:pointer-events-auto group-hover:opacity-100 md:min-w-max">
        {label}
      </span>
      {children}
    </div>
  );
};
