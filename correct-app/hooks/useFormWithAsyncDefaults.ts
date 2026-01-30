'use client';

import { useEffect } from 'react';
import {
	useForm,
	UseFormProps,
	UseFormReturn,
	FieldValues,
	DefaultValues,
} from 'react-hook-form';

/**
 * A wrapper around react-hook-form's useForm that handles async default values.
 *
 * Problem: useForm's defaultValues only evaluates once on mount. If the data
 * comes from an async source (like context that fetches from API), the form
 * will initialize with empty values.
 *
 * Solution: This hook watches a data dependency and calls reset() when it changes.
 *
 * @param asyncData - The async data to watch (e.g., company, user from context)
 * @param getDefaultValues - A function that returns the default values from the async data
 * @param options - All other useForm options
 */
export function useFormWithAsyncDefaults<
	TFieldValues extends FieldValues = FieldValues,
	TData = unknown,
>(
	asyncData: TData | null | undefined,
	getDefaultValues: (data: TData) => DefaultValues<TFieldValues>,
	options?: Omit<UseFormProps<TFieldValues>, 'defaultValues'>
): UseFormReturn<TFieldValues> {
	const form = useForm<TFieldValues>({
		...options,
		defaultValues: asyncData
			? getDefaultValues(asyncData)
			: (undefined as DefaultValues<TFieldValues>),
	});

	useEffect(() => {
		if (asyncData) {
			form.reset(getDefaultValues(asyncData));
		}
	}, [asyncData]);

	return form;
}
