export async function uploadToS3(
	presignedUrl: string,
	file: File | Blob
): Promise<{ success: boolean; message: string; error?: unknown }> {
	console.log('presignedUrl', presignedUrl);
	try {
		if (!presignedUrl) {
			throw new Error('Presigned URL is required');
		}

		const response = await fetch(presignedUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': file.type,
			},
			body: file,
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Upload failed with status ${response.status}: ${errorText}`
			);
		}

		return {
			success: true,
			message: 'File uploaded successfully',
		};
	} catch (error) {
		console.error('Error uploading to S3:', error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to upload file to S3',
			error,
		};
	}
}
