'use client';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;

console.log('supabaseBucket', supabaseBucket);
console.log('supabaseUrl', supabaseUrl);
console.log('supabaseAnonKey', supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadFileToSupabaseClient(
	file: File,
	folderId: string | null,
	fileName: string
) {
	try {
		const timestamp = new Date().getTime();
		const filePath = folderId
			? `${folderId}/${timestamp}-${fileName}`
			: `root/${timestamp}-${fileName}`;

		const { data, error } = await supabase.storage
			.from(supabaseBucket)
			.upload(filePath, file, {
				cacheControl: '3600',
				upsert: false,
			});

		console.log('data', data);
		console.log('error', error);

		if (error) {
			throw error;
		}

		const { data: publicUrlData } = supabase.storage
			.from(supabaseBucket)
			.getPublicUrl(filePath);

		return {
			success: true,
			url: publicUrlData.publicUrl,
			key: filePath,
			message: 'File uploaded successfully',
		};
	} catch (error) {
		console.error('Error uploading file:', error);
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to upload file',
		};
	}
}
