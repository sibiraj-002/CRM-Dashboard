"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, ShieldCheck, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DashboardLayout } from "@/components/layout";
import {
    getUsers,
    updateUserRole,
    updateUserStatus,
} from "@/services/userService";

const roleOptions = ["admin", "editor", "author", "viewer"];

function formatDate(date) {
    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

function RoleBadge({ role }) {
    return (
        <Badge variant="outline" className="capitalize">
            {role || "viewer"}
        </Badge>
    );
}

function StatusBadge({ status }) {
    const isActive = status === "active";

    return (
        <Badge
            className={
                isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
            }
        >
            {status || "inactive"}
        </Badge>
    );
}

export function UsersManagementView() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [roleTarget, setRoleTarget] = useState(null);
    const [selectedRole, setSelectedRole] = useState("");
    const [statusTarget, setStatusTarget] = useState(null);
    const [nextStatus, setNextStatus] = useState("");
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            const message = error.message || "Failed to load users";
            setUsers([]);
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    function openRoleDialog(user) {
        setRoleTarget(user);
        setSelectedRole(user.role || "viewer");
    }

    function openStatusDialog(user, status) {
        setStatusTarget(user);
        setNextStatus(status);
    }

    async function handleRoleChange() {
        if (!roleTarget || !selectedRole) {
            return;
        }

        setIsUpdatingRole(true);

        try {
            await updateUserRole(roleTarget.id, selectedRole);
            toast.success("User role updated successfully");
            setRoleTarget(null);
            setSelectedRole("");
            await fetchUsers();
        } catch (error) {
            toast.error(error.message || "Failed to update user role");
        } finally {
            setIsUpdatingRole(false);
        }
    }

    async function handleStatusChange() {
        if (!statusTarget || !nextStatus) {
            return;
        }

        setIsUpdatingStatus(true);

        try {
            await updateUserStatus(statusTarget.id, nextStatus);
            toast.success(
                nextStatus === "active"
                    ? "User activated successfully"
                    : "User deactivated successfully",
            );
            setStatusTarget(null);
            setNextStatus("");
            await fetchUsers();
        } catch (error) {
            toast.error(error.message || "Failed to update user status");
        } finally {
            setIsUpdatingStatus(false);
        }
    }

    return (
        <DashboardLayout title="Users">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Users
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Manage user roles and account status.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>
                            {isLoading
                                ? "Loading users..."
                                : `${users.length} user${users.length === 1 ? "" : "s"} found`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading users...
                            </div>
                        ) : errorMessage ? (
                            <div className="rounded-lg border border-dashed py-12 text-center">
                                <p className="text-sm font-medium">Failed to load users</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {errorMessage}
                                </p>
                                <Button
                                    className="mt-4"
                                    variant="outline"
                                    onClick={fetchUsers}
                                >
                                    Try again
                                </Button>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="rounded-lg border border-dashed py-12 text-center">
                                <p className="text-sm font-medium">No users found</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Users will appear here after they are created in Firestore.
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.name || "—"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {user.email || "—"}
                                            </TableCell>
                                            <TableCell>
                                                <RoleBadge role={user.role} />
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={user.status} />
                                            </TableCell>
                                            <TableCell>{formatDate(user.createdAt)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openRoleDialog(user)}
                                                    >
                                                        <ShieldCheck className="h-4 w-4" />
                                                        Change Role
                                                    </Button>
                                                    {user.status === "active" ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                openStatusDialog(user, "inactive")
                                                            }
                                                        >
                                                            <UserX className="h-4 w-4" />
                                                            Deactivate
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-green-700 hover:text-green-700 dark:text-green-300 dark:hover:text-green-300"
                                                            onClick={() =>
                                                                openStatusDialog(user, "active")
                                                            }
                                                        >
                                                            <UserCheck className="h-4 w-4" />
                                                            Activate
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={!!roleTarget}
                onOpenChange={(open) => {
                    if (!open) {
                        setRoleTarget(null);
                        setSelectedRole("");
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change user role</DialogTitle>
                        <DialogDescription>
                            Select a new role for {roleTarget?.name || roleTarget?.email}.
                        </DialogDescription>
                    </DialogHeader>
                    <Select
                        value={selectedRole}
                        onValueChange={setSelectedRole}
                        disabled={isUpdatingRole}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roleOptions.map((role) => (
                                <SelectItem key={role} value={role}>
                                    <span className="capitalize">{role}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRoleTarget(null)}
                            disabled={isUpdatingRole}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleRoleChange} disabled={isUpdatingRole}>
                            {isUpdatingRole ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Role"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={!!statusTarget}
                onOpenChange={(open) => {
                    if (!open) {
                        setStatusTarget(null);
                        setNextStatus("");
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {nextStatus === "active" ? "Activate user" : "Deactivate user"}
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {nextStatus === "active" ? "activate" : "deactivate"}{" "}
                            {statusTarget?.name || statusTarget?.email}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setStatusTarget(null)}
                            disabled={isUpdatingStatus}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={nextStatus === "active" ? "default" : "destructive"}
                            onClick={handleStatusChange}
                            disabled={isUpdatingStatus}
                        >
                            {isUpdatingStatus ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : nextStatus === "active" ? (
                                "Activate"
                            ) : (
                                "Deactivate"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
