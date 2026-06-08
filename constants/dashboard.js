import { BookOpen, FileText, Image, Mic, Newspaper } from "lucide-react";

export const mockUser = {
  name: "Alex Morgan",
  email: "alex.morgan@intelligencecrm.com",
  initials: "AM",
  role: "Content Manager",
};

export const dashboardStats = [
  {
    id: "blogs",
    title: "Total Blogs",
    value: "128",
    change: "+12.4%",
    changeLabel: "vs last month",
    icon: BookOpen,
    iconClassName: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    id: "articles",
    title: "Total Articles",
    value: "342",
    change: "+8.2%",
    changeLabel: "vs last month",
    icon: FileText,
    iconClassName: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    id: "news",
    title: "Total News",
    value: "89",
    change: "+5.1%",
    changeLabel: "vs last month",
    icon: Newspaper,
    iconClassName: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    id: "podcasts",
    title: "Total Podcasts",
    value: "56",
    change: "+18.7%",
    changeLabel: "vs last month",
    icon: Mic,
    iconClassName: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    id: "media",
    title: "Total Media",
    value: "1,204",
    change: "+3.9%",
    changeLabel: "vs last month",
    icon: Image,
    iconClassName: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];
