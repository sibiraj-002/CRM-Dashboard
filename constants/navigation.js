import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Newspaper,
  Mic,
  Tags,
  Image,
  Calendar,
  Settings,
} from "lucide-react";

export const mainNavigation = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Blogs",
    href: "/blogs",
    icon: BookOpen,
  },
  {
    label: "Articles",
    href: "/articles",
    icon: FileText,
  },
  {
    label: "News",
    href: "/news",
    icon: Newspaper,
  },
  {
    label: "Podcasts",
    href: "/podcasts",
    icon: Mic,
  },
  {
    label: "Categories",
    href: "/categories",
    icon: Tags,
  },
  {
    label: "Media Library",
    href: "/media-library",
    icon: Image,
  },
  {
    label: "Scheduling",
    href: "/scheduling",
    icon: Calendar,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function isNavItemActive(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
