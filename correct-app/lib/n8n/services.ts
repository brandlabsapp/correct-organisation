import { errorHandler } from '../errorHandler';
import { responseWrapper } from '../responseWrapper';

export const analyseFile = async (formData: FormData) => {
	try {
		const response = await fetch(
			'https://flow.mindvision.ai/webhook/analyse-file',
			{
				method: 'POST',
				body: formData,
			}
		);

		if (!response.ok) {
			return errorHandler(response, 'File uploaded failed', 500);
		}

		const data = await response.json();

		console.log(data);

		return responseWrapper(data, true, 'File uploaded successfully', 'success');
	} catch (error) {
		return errorHandler(error, 'File uploaded failed', 500);
	}
};
