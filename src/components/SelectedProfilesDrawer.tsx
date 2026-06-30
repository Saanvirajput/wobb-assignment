import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Trash2, Users, Download } from "lucide-react";
import { useListStore } from "@/store/useListStore";
import { cn } from "@/utils/cn";

export function SelectedProfilesDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedProfiles, removeProfile } = useListStore();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap: focus close button when drawer opens
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    // Prevent body scroll when drawer is open
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleProceed = useCallback(() => {
    const data = JSON.stringify(selectedProfiles, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vibe_selected_creators.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [selectedProfiles]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label={`Open selected profiles list. ${selectedProfiles.length} profiles selected.`}
        className="relative flex items-center gap-3 px-6 py-3 coke-panel font-semibold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-coke-red/30"
      >
        <span>List</span>
        {selectedProfiles.length > 0 && (
          <span className="inline-flex items-center justify-center w-6 h-6 text-sm font-black bg-white text-coke">
            {selectedProfiles.length}
          </span>
        )}
      </button>

      {/* Render Drawer in Portal to escape backdrop-filter containing block */}
      {createPortal(
          <>
            {/* Backdrop */}
            {isOpen && (
              <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] transition-opacity"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />
            )}

            {/* Drawer */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Selected profiles"
              className={cn(
                "fixed inset-y-0 right-0 w-full max-w-md bg-slate-100 border-l border-slate-300 shadow-2xl z-[101] transform transition-transform duration-500 flex flex-col text-slate-800",
                isOpen ? "translate-x-0" : "translate-x-full"
              )}
            >
              <div className="flex items-center justify-between p-8 border-b border-slate-300">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-coke">
                  Selection
                </h2>
                <button
                  ref={closeButtonRef}
                  onClick={() => setIsOpen(false)}
                  aria-label="Close selection drawer"
                  className="p-3 text-slate-500 hover:text-coke bg-slate-200 hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-coke-red/30"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedProfiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-6">
                    <Users className="w-16 h-16 opacity-20" />
                    <p className="font-medium tracking-wide uppercase">
                      No profiles added
                    </p>
                  </div>
                ) : (
                  selectedProfiles.map((profile) => (
                    <div
                      key={`${profile.platform}-${profile.username}`}
                      className="flex items-center gap-4 p-4 liquid-silver group border border-slate-300"
                    >
                      <img
                        src={profile.picture}
                        alt={`${profile.username}'s profile`}
                        className="w-14 h-14 object-cover border border-slate-300 droplet-shape grayscale group-hover:grayscale-0 transition-all duration-500 relative z-10"
                      />
                      <div className="flex-1 min-w-0 relative z-10">
                        <p className="text-base font-bold text-slate-800 truncate tracking-tight">
                          @{profile.username}
                        </p>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
                          {profile.platform}
                        </p>
                      </div>
                      <button
                        onClick={() => removeProfile(profile.username)}
                        aria-label={`Remove ${profile.username} from list`}
                        className="p-3 text-slate-500 hover:text-coke hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-coke-red/30 relative z-10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {selectedProfiles.length > 0 && (
                <div className="p-6 border-t border-slate-300 bg-slate-100">
                  <button
                    onClick={handleProceed}
                    aria-label={`Export ${selectedProfiles.length} selected profiles as JSON`}
                    className="w-full py-4 coke-panel font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-coke-red/30"
                  >
                    <Download className="w-5 h-5" />
                    Export ({selectedProfiles.length})
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
