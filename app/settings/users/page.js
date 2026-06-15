import { UsersManagementView } from "@/components/settings";

export const metadata = {
    title: "Users | Intelligence CRM",
    description: "Manage user roles and account status",
};

export default function SettingsUsersPage() {
    return <UsersManagementView />;
}
