'use client';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabaseBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a file to Supabase Storage with structure: vault/{companyId}/{folderId|root}/{timestamp}-{fileName}
 */
export async function uploadFileToSupabaseClient(
	file: File,
	companyId: string | number,
	folderId: string | null,
	fileName: string
) {
	try {
		if (!supabaseBucket?.trim()) {
			return {
				success: false,
				message:
					'Storage bucket not configured. Add NEXT_PUBLIC_SUPABASE_BUCKET to your .env (e.g. vault or your Supabase bucket name).',
			};
		}
		if (!supabaseUrl?.trim() || !supabaseAnonKey?.trim()) {
			return {
				success: false,
				message:
					'Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.',
			};
		}

		const timestamp = new Date().getTime();
		const companySegment = String(companyId);
		const folderSegment = folderId?.trim() ? folderId : 'root';
		const filePath = `vault/${companySegment}/${folderSegment}/${timestamp}-${fileName}`;

		const { data, error } = await supabase.storage
			.from(supabaseBucket)
			.upload(filePath, file, {
				cacheControl: '3600',
				upsert: false,
			});

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
