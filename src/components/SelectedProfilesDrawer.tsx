import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Trash2, Download, ListChecks } from "lucide-react";
import { useListStore } from "@/store/useListStore";
import { PLATFORM_META } from "@/utils/dataHelpers";
import { formatCompact } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import { FloatingSticker } from "./FloatingSticker";
import loadingHeart from "@/assets/loading-heart.gif";

export function SelectedProfilesDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const selectedProfiles = useListStore((s) => s.selectedProfiles);
  const removeProfile = useListStore((s) => s.removeProfile);
  const clear = useListStore((s) => s.clear);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const count = selectedProfiles.length;

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(selectedProfiles, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vibe-selected-creators.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [selectedProfiles]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label={`Open shortlist, ${count} ${
          count === 1 ? "creator" : "creators"
        } selected`}
        className="btn-pill relative inline-flex items-center gap-2 border border-ink-900/10 bg-white px-4 py-2 text-sm font-medium text-ink-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-ink-900/20 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        <ListChecks className="h-4 w-4" />
        <span className="hidden sm:inline">Shortlist</span>
        {count > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-bold text-white">
            {count}
          </span>
        )}
      </button>

      {createPortal(
        <>
          <div
            className={cn(
              "fixed inset-0 z-[100] bg-ink-900/30 backdrop-blur-sm transition-opacity duration-300 ease-out",
              isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            )}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Selected creators shortlist"
            className={cn(
              "fixed inset-y-0 right-0 z-[101] flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              isOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="flex items-center justify-between border-b border-ink-900/[0.06] px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.01em] text-ink-900">
                  Shortlist
                </h2>
                <p className="text-xs text-ink-400">
                  {count} {count === 1 ? "creator" : "creators"} selected
                </p>
              </div>
              <button
                ref={closeButtonRef}
                onClick={() => setIsOpen(false)}
                aria-label="Close shortlist"
                className="rounded-full p-2 text-ink-400 transition-colors hover:bg-slate-100 hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {count === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <FloatingSticker src={loadingHeart} className="h-14 w-14" />
                  <p className="font-semibold text-ink-900">
                    Your shortlist is empty
                  </p>
                  <p className="max-w-[16rem] text-sm text-ink-600">
                    Add creators from the search results to build your list.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {selectedProfiles.map((profile) => (
                    <li
                      key={`${profile.platform}-${profile.username}`}
                      className="flex items-center gap-3 rounded-2xl border border-ink-900/[0.06] p-3"
                    >
                      <img
                        src={profile.picture}
                        alt={`${profile.username}'s avatar`}
                        loading="lazy"
                        className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink-900">
                          {profile.fullname}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-ink-400">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              PLATFORM_META[profile.platform].dotClass
                            )}
                          />
                          <span className="truncate">
                            @{profile.username} · {formatCompact(profile.followers)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeProfile(profile.username)}
                        aria-label={`Remove ${profile.username} from shortlist`}
                        className="rounded-full p-2 text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {count > 0 && (
              <div className="space-y-2 border-t border-ink-900/[0.06] p-4">
                <button
                  onClick={handleExport}
                  className="btn-pill inline-flex w-full items-center justify-center gap-2 bg-ink-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  <Download className="h-4 w-4" /> Export as JSON
                </button>
                <button
                  onClick={clear}
                  className="btn-pill inline-flex w-full items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-ink-400 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </>,
        document.body
      )}
    </>
  );
}
