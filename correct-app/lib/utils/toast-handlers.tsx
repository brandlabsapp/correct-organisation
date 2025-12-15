'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';

interface ErrorToastOptions {
	title?: string;
	message?: string;
	statusCode?: number;
	error?: unknown;
	action?: {
		label: string;
		onClick: () => void;
	};
}

interface SuccessToastOptions {
	title?: string;
	message?: string;
	action?: {
		label: string;
		onClick: () => void;
	};
}

interface ErrorResponse {
	statusCode?: number;
	error?: string;
	message?: string;
	timestamp?: string;
	path?: string;
}

interface LoadingToastOptions {
	title?: string;
	message?: string;
	duration?: number;
	className?: string;
}

const ERROR_MESSAGES: Record<number, { title: string; message: string }> = {
	400: {
		title: 'Bad Request',
		message: 'The request was invalid or cannot be served.',
	},
	401: {
		title: 'Unauthorized',
		message: 'You need to be logged in to access this resource.',
	},
	403: {
		title: 'Forbidden',
		message: "You don't have permission to access this resource.",
	},
	404: {
		title: 'Not Found',
		message: 'The requested resource could not be found.',
	},
	408: {
		title: 'Request Timeout',
		message: 'The request took too long to process. Please try again.',
	},
	429: {
		title: 'Too Many Requests',
		message: "You've made too many requests. Please try again later.",
	},
	500: {
		title: 'Server Error',
		message: 'Something went wrong on our end. Please try again later.',
	},
	502: {
		title: 'Bad Gateway',
		message: 'The server received an invalid response. Please try again.',
	},
	503: {
		title: 'Service Unavailable',
		message: 'The service is temporarily unavailable. Please try again later.',
	},
	504: {
		title: 'Gateway Timeout',
		message: 'The server timed out waiting for a response. Please try again.',
	},
};

function extractErrorDetails(error: ErrorResponse): ErrorResponse {
	console.log('error', error);
	return {
		statusCode: error.statusCode,
		message: error.message,
		error: error.error,
		path: error.path,
	};
}

export async function showErrorToast({
	title,
	message,
	statusCode,
	error,
	action,
}: ErrorToastOptions) {
	let extractedDetails: { statusCode?: number; message?: string } = {
		statusCode: undefined,
		message: undefined,
	};

	if (error) {
		extractedDetails = extractErrorDetails(error);

		if (
			error instanceof Response &&
			error.status !== 204 &&
			error.headers.get('content-type')?.includes('application/json')
		) {
			try {
				const errorClone = error.clone();
				const errorData = await errorClone.json();
				if (errorData.message) {
					extractedDetails.message = errorData.message;
				}
			} catch (e) {
				console.warn('Failed to parse error response JSON', e);
			}
		}
	}

	const finalStatusCode = statusCode || extractedDetails.statusCode;
	const defaultError = finalStatusCode && ERROR_MESSAGES[finalStatusCode];

	const finalTitle =
		title || (defaultError ? defaultError.title : 'Something went wrong');
	const finalMessage =
		message ||
		extractedDetails.message ||
		(defaultError
			? defaultError.message
			: 'An unexpected error occurred. Please try again.');

	return toast({
		variant: 'destructive',
		title: finalTitle,
		description: (
			<div className='mt-1 text-sm text-destructive-foreground/90'>
				{finalMessage}
			</div>
		),
		action: action && (
			<Button size='sm' variant='outline' onClick={action.onClick}>
				<RefreshCw className='mr-2 h-4 w-4' />
				{action.label}
			</Button>
		),
		duration: 4000,
		className: 'border-destructive bg-red-light text-destructive',
	});
}

export function showSuccessToast({
	title = 'Success',
	message = 'Operation completed successfully.',
	action,
}: SuccessToastOptions) {
	return toast({
		title: title,
		description: <div className='mt-1 text-sm text-black'>{message}</div>,
		action: action && (
			<Button size='sm' onClick={action.onClick}>
				{action.label}
			</Button>
		),
		duration: 3000,
		className: 'border-green-500 bg-green text-black',
	});
}

export function showLoadingToast({
	title = 'Loading',
	message = 'Please wait...',
	duration = 0,
	className = 'bg-black text-white',
}: LoadingToastOptions) {
	return toast({
		title: title,
		description: (
			<div className='mt-1 flex items-center gap-2'>
				<div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
				<span className='text-sm text-white'>{message}</span>
			</div>
		),
		duration: duration,
		className: className,
	});
}
