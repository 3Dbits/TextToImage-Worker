interface TextPromptRequest {
	prompt: string;
	num_steps?: number;
}

interface ImageResponse {
	success: boolean;
	imageBase64?: String;
	error?: string;
}

interface TextToImageOutput {
	image: String;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
				},
			});
		}

		if (request.method !== 'POST') {
			return Response.json({ success: false, error: 'Method not allowed' }, { status: 405 });
		}

		try {
			const apiKey = request.headers?.get('X-API-Key');
			if (apiKey !== env.VALID_API_KEY) {
				return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
			}

			const model = '@cf/black-forest-labs/flux-1-schnell' as BaseAiTextToImageModels;
			const requestData = (await request.json()) as TextPromptRequest;

			const translationRequest: BaseAiTextToImage['inputs'] = {
				prompt: requestData.prompt,
				num_steps: requestData.num_steps || 4,
			};

			if (!translationRequest.prompt) {
				return Response.json({ success: false, error: 'Text field is required' }, { status: 400 });
			}

			const translation = (await env.AI.run(model, translationRequest)) as unknown as TextToImageOutput;

			const response: ImageResponse = {
				success: true,
				imageBase64: translation.image,
			};

			return Response.json(response, {
				headers: {
					'Access-Control-Allow-Origin': '*',
				},
			});
		} catch (error) {
			const response: ImageResponse = {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};

			return Response.json(response, {
				status: 500,
				headers: {
					'Access-Control-Allow-Origin': '*',
				},
			});
		}
	},
} satisfies ExportedHandler<Env>;
