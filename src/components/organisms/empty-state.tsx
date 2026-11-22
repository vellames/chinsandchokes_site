import Image from "next/image";
import type { ReactNode } from "react";

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center border border-dashed border-line px-6 py-20 text-center">
      <Image src="/brand/mark.png" alt="" width={56} height={56} />
      <p className="headline mt-6 text-4xl text-bone">{title}</p>
      {children && <div className="mt-3 max-w-md text-sm text-muted">{children}</div>}
    </div>
  );
}
