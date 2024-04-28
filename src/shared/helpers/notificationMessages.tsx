import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

const notificationTitles: Record<string, string> = {
	success: 'Success',
	error: 'Error',
	pending: 'Pending',
};

const success = (title: string, message: string) =>
	notifications.show({
		title: title,
		message: message,
		autoClose: 3000,
		color: 'green.5',
		icon: <IconCheck size={16} />,
		withCloseButton: true,
		classNames: {
			root: 'bg-gray-800 backdrop-blur-lg',
			body: 'bg-gray-800',
			closeButton: 'text-white/50',
			title: 'text-white font-body font-semibold',
			description: 'text-white/70 font-body',
		},
	});

const error = (title: string, message: string) =>
	notifications.show({
		title: title,
		message: message,
		autoClose: 3000,
		color: 'red.5',
		icon: <IconX size={16} />,
		withCloseButton: true,
		classNames: {
			root: 'bg-gray-800 backdrop-blur-lg',
			body: 'bg-gray-800',
			closeButton: 'text-white/50',
			title: 'text-white font-body font-semibold',
			description: 'text-white/70 font-body',
		},
	});

const notification = {
	success,
	error,
};

export { notification, notificationTitles };
