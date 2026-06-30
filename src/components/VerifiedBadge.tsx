import { BadgeCheck } from "lucide-react";
import { cn } from "@/utils/cn";

interface VerifiedBadgeProps {
  verified: boolean;
  className?: string;
}

export function VerifiedBadge({ verified, className }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <BadgeCheck
      role="img"
      aria-label="Verified account"
      className={cn("inline-block shrink-0 text-brand-600", className)}
    />
  );
}
