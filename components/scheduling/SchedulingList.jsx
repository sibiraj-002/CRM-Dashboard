"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    CalendarClock,
    Loader2,
    Pencil,
    Plus,
    Search,
    Trash2,
    XCircle,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
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
    deleteSchedule,
    getSchedules,
    updateSchedule,
} from "@/services/schedulingService";

function formatDate(date) {
    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function formatContentType(contentType) {
    if (!contentType) {
        return "—";
    }

    return contentType
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function ScheduleStatusBadge({ status }) {
    const classes = {
        scheduled:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
        published:
            "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
        cancelled:
            "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    };

    return (
        <Badge className={classes[status] || classes.scheduled}>
            {status || "scheduled"}
        </Badge>
    );
}

export function SchedulingList() {
    const router = useRouter();
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [cancelTarget, setCancelTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchSchedules = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const data = await getSchedules();
            setSchedules(data);
        } catch (error) {
            const message = error.message || "Failed to load schedules";
            setSchedules([]);
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const filteredSchedules = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return schedules;
        }

        return schedules.filter((schedule) => {
            const contentType = formatContentType(schedule.contentType).toLowerCase();

            return (
                schedule.title?.toLowerCase().includes(query) ||
                contentType.includes(query) ||
                schedule.status?.toLowerCase().includes(query)
            );
        });
    }, [schedules, searchQuery]);

    async function handleCancel() {
        if (!cancelTarget) {
            return;
        }

        setIsCancelling(true);

        try {
            await updateSchedule(cancelTarget.id, { status: "cancelled" });
            toast.success("Schedule cancelled successfully");
            setCancelTarget(null);
            await fetchSchedules();
        } catch (error) {
            toast.error(error.message || "Failed to cancel schedule");
        } finally {
            setIsCancelling(false);
        }
    }

    async function handleDelete() {
        if (!deleteTarget) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteSchedule(deleteTarget.id);
            toast.success("Schedule deleted successfully");
            setDeleteTarget(null);
            await fetchSchedules();
        } catch (error) {
            toast.error(error.message || "Failed to delete schedule");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <DashboardLayout title="Scheduling">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Scheduling
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Schedule content publishing across channels.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/scheduling/create">
                            <Plus className="h-4 w-4" />
                            Add Schedule
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Scheduled Posts</CardTitle>
                        <CardDescription>
                            {isLoading
                                ? "Loading schedules..."
                                : `${filteredSchedules.length} schedule${filteredSchedules.length === 1 ? "" : "s"} found`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative max-w-sm">
                            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by title, type, or status..."
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                className="pl-8"
                            />
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading schedules...
                            </div>
                        ) : errorMessage ? (
                            <div className="rounded-lg border border-dashed py-12 text-center">
                                <p className="text-sm font-medium">
                                    Failed to load schedules
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {errorMessage}
                                </p>
                                <Button
                                    className="mt-4"
                                    variant="outline"
                                    onClick={fetchSchedules}
                                >
                                    Try again
                                </Button>
                            </div>
                        ) : filteredSchedules.length === 0 ? (
                            <div className="rounded-lg border border-dashed py-12 text-center">
                                <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <p className="mt-4 text-sm font-medium">
                                    No schedules found
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {searchQuery
                                        ? "Try a different search term."
                                        : "Create your first schedule to plan content publishing."}
                                </p>
                                {!searchQuery ? (
                                    <Button asChild className="mt-4" variant="outline">
                                        <Link href="/scheduling/create">
                                            <Plus className="h-4 w-4" />
                                            Add Schedule
                                        </Link>
                                    </Button>
                                ) : null}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Content Type</TableHead>
                                            <TableHead>Scheduled Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredSchedules.map((schedule) => (
                                            <TableRow key={schedule.id}>
                                                <TableCell className="font-medium">
                                                    {schedule.title}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {formatContentType(schedule.contentType)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(schedule.scheduledAt)}
                                                </TableCell>
                                                <TableCell>
                                                    <ScheduleStatusBadge
                                                        status={schedule.status}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            onClick={() =>
                                                                router.push(
                                                                    `/scheduling/edit/${schedule.id}`,
                                                                )
                                                            }
                                                            aria-label={`Edit ${schedule.title}`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            className="text-yellow-700 hover:text-yellow-700 dark:text-yellow-300 dark:hover:text-yellow-300"
                                                            onClick={() =>
                                                                setCancelTarget(schedule)
                                                            }
                                                            disabled={
                                                                schedule.status === "cancelled"
                                                            }
                                                            aria-label={`Cancel ${schedule.title}`}
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                setDeleteTarget(schedule)
                                                            }
                                                            aria-label={`Delete ${schedule.title}`}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={!!cancelTarget}
                onOpenChange={(open) => !open && setCancelTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel schedule</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this schedule?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCancelTarget(null)}
                            disabled={isCancelling}
                        >
                            Keep Schedule
                        </Button>
                        <Button onClick={handleCancel} disabled={isCancelling}>
                            {isCancelling ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Cancelling...
                                </>
                            ) : (
                                "Cancel Schedule"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete schedule</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this schedule?
                            <br />
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
