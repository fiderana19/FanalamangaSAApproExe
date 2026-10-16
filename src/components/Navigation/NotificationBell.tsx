import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { NOTIFICATION_TYPE_STYLE, getNotificationTypeLabel } from "@/constants/NotificationType";
import { useNotifications } from "@/context/NotificationContext";
import { formatDate } from "@/utils/Date";
import { Bell } from "lucide-react";

const NotificationBell = () => {
    const { notifications, nonLus, marquerLue, marquerToutesLues } =
        useNotifications();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type='button'
                    variant='secondary'
                    size='sm'
                    className='relative bg-gray-100 text-gray-600 hover:bg-[#e9f5ee] hover:text-brand rounded-md'
                >
                    <Bell />
                    Notifications
                    {nonLus > 0 && (
                        <span className='absolute -top-1.5 -right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white'>
                            {nonLus > 9 ? "9+" : nonLus}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align='end' className='w-96 p-0'>
                <div className='flex items-center justify-between border-b border-brand-border px-4 py-3'>
                    <b className='text-sm'>Notifications</b>
                    {nonLus > 0 && (
                        <button
                            type='button'
                            onClick={() => marquerToutesLues()}
                            className='text-xs font-medium text-brand hover:underline'
                        >
                            Tout marquer comme lu
                        </button>
                    )}
                </div>
                <div className='max-h-96 overflow-y-auto'>
                    {notifications.length === 0 ? (
                        <div className='px-4 py-8 text-center text-sm text-brand-muted'>
                            Aucune notification
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <button
                                key={notification._id}
                                type='button'
                                onClick={() =>
                                    !notification.estLu &&
                                    marquerLue(notification._id)
                                }
                                className={`flex w-full gap-3 border-b border-brand-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-brand-bg ${
                                    notification.estLu ? "" : "bg-[#f4faf6]"
                                }`}
                            >
                                <span
                                    className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                                        notification.estLu
                                            ? "bg-transparent"
                                            : "bg-brand"
                                    }`}
                                />
                                <span className='flex-1'>
                                    <span className='flex items-center justify-between gap-2'>
                                        <b className='text-sm'>{notification.titre}</b>
                                        <span
                                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                NOTIFICATION_TYPE_STYLE[
                                                    notification.typeNotification
                                                ] ?? "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {getNotificationTypeLabel(
                                                notification.typeNotification,
                                            )}
                                        </span>
                                    </span>
                                    <span className='mt-0.5 block text-xs text-gray-600'>
                                        {notification.message}
                                    </span>
                                    <span className='mt-1 block text-[11px] text-brand-muted'>
                                        {formatDate(notification.dateEnvoie)}
                                    </span>
                                </span>
                            </button>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;
