"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { sectionIds, type SectionId } from "@/lib/site";
import Sidebar from "./Sidebar";
import SiteHeader from "./SiteHeader";
import { useScrollSpy } from "./useScrollSpy";

const DESKTOP_QUERY = "(min-width: 1024px)";
const STORAGE_KEY = "portfolio:sidebar-collapsed";

/* ---- Desktop "collapsed" preference, remembered in localStorage ---- */
const collapsedListeners = new Set<() => void>();
let memoryCollapsed: boolean | null = null;

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeCollapsed(value: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    // Storage can be blocked (private mode). The toggle still works for this visit.
  }
  memoryCollapsed = value;
  collapsedListeners.forEach((listener) => listener());
}

function subscribeCollapsed(callback: () => void) {
  collapsedListeners.add(callback);
  return () => {
    collapsedListeners.delete(callback);
  };
}

function getCollapsed() {
  return memoryCollapsed ?? readCollapsed();
}

/* ---- Viewport size ---- */
function subscribeDesktop(callback: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

const getDesktop = () => window.matchMedia(DESKTOP_QUERY).matches;

/* ---- Context shared by the header and sidebar ---- */
type ShellState = {
  isDesktop: boolean;
  collapsed: boolean;
  mobileOpen: boolean;
  /** true when the sidebar is off-screen at the current size */
  sidebarHidden: boolean;
  activeId: SectionId;
  toggleSidebar: () => void;
  closeMobile: () => void;
};

const ShellContext = createContext<ShellState | null>(null);

export function useShell() {
  const value = useContext(ShellContext);
  if (!value) throw new Error("useShell must be used inside <AppShell>");
  return value;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const isDesktop = useSyncExternalStore(subscribeDesktop, getDesktop, () => true);
  const collapsed = useSyncExternalStore(subscribeCollapsed, getCollapsed, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useScrollSpy(sectionIds);

  const toggleSidebar = useCallback(() => {
    if (window.matchMedia(DESKTOP_QUERY).matches) {
      writeCollapsed(!getCollapsed());
    } else {
      setMobileOpen((open) => !open);
    }
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Turn on sidebar/content transitions after the first paint
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      document.documentElement.dataset.shellReady = "true";
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Mobile drawer: lock page scroll and close with Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const drawerOpen = mobileOpen && !isDesktop;
  const sidebarHidden = isDesktop ? collapsed : !drawerOpen;

  const value = useMemo<ShellState>(
    () => ({
      isDesktop,
      collapsed,
      mobileOpen: drawerOpen,
      sidebarHidden,
      activeId,
      toggleSidebar,
      closeMobile,
    }),
    [isDesktop, collapsed, drawerOpen, sidebarHidden, activeId, toggleSidebar, closeMobile],
  );

  return (
    <ShellContext.Provider value={value}>
      <a
        href="#main"
        className="sr-only font-hud focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-accent focus:px-4 focus:py-2 focus:font-bold focus:uppercase focus:text-ink"
      >
        Skip to content
      </a>

      <Sidebar />
      <SiteHeader />

      <div
        className={`shell-shift px-3 pb-6 pt-[5.25rem] sm:px-4 ${
          collapsed ? "lg:pl-4" : "lg:pl-[104px]"
        }`}
      >
        <main id="main" className="mx-auto flex max-w-[1180px] flex-col gap-5">
          {children}
        </main>
      </div>
    </ShellContext.Provider>
  );
}
