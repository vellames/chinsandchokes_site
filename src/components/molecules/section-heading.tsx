import type { ReactNode } from "react";

export function SectionHeading({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 border-b border-line pb-3">
      <h2 className="headline text-4xl text-bone">{children}</h2>
      {action}
    </div>
  );
}
