# Text-to-Image API

A Cloudflare Workers API that converts text prompts into images using the Flux AI model from Black Forest Labs.

## Features

- Text to image generation using `@cf/black-forest-labs/flux-1-schnell` model
- API key authentication
- Configurable generation steps
- CORS support
- Error handling and validation

## API Reference

### Convert Text to Image

```http
POST /
```

#### Request Headers

| Header         | Type     | Description                |
| -------------- | -------- | -------------------------- |
| `X-API-Key`    | `string` | **Required**. Your API key |
| `Content-Type` | `string` | Must be `application/json` |

#### Request Body

```typescript
{
  "prompt": string,     // Required: Text description of the image to generate
  "num_steps": number   // Optional: Number of generation steps (default: 4)
}
```

#### Response

```typescript
{
  "success": boolean,
  "imageBase64": string,  // Base64 encoded image data (only if success is true)
  "error": string        // Error message (only if success is false)
}
```

#### Status Codes

| Status Code | Description                                 |
| ----------- | ------------------------------------------- |
| 200         | Success                                     |
| 400         | Bad Request - Missing or invalid parameters |
| 401         | Unauthorized - Invalid API key              |
| 405         | Method Not Allowed                          |
| 500         | Internal Server Error                       |

## Example Usage

```javascript
const response = await fetch('YOUR_WORKER_URL', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'X-API-Key': 'YOUR_API_KEY',
	},
	body: JSON.stringify({
		prompt: 'A beautiful sunset over mountains',
		num_steps: 4,
	}),
});

const data = await response.json();
if (data.success) {
	const image = `data:image/png;base64,${data.imageBase64}`;
	// Use the image...
}
```

## Error Handling

The API returns detailed error messages in the following format:

```typescript
{
  "success": false,
  "error": "Error message description"
}
```

Common error scenarios:

- Missing or invalid API key
- Missing prompt in request body
- Internal server errors during image generation

## CORS Support

The API includes CORS support with the following configurations:

- Allowed Methods: POST, OPTIONS
- Allowed Headers: Content-Type, X-API-Key
- Allowed Origins: \* (all origins)

## Environment Variables

| Variable        | Description                |
| --------------- | -------------------------- |
| `VALID_API_KEY` | API key for authentication |

## Technical Details

- Built with Cloudflare Workers
- Uses Black Forest Labs' Flux AI model for image generation
- Supports configurable generation steps (default: 4)
- Returns Base64 encoded image data

## TypeScript Interfaces

```typescript
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
```

## Security

- API key authentication required for all requests
- CORS headers configured for secure cross-origin requests
- Input validation for all request parameters

## Limitations

- Maximum generation steps may be limited by the underlying AI model
- Response times may vary based on the complexity of the prompt
- API key must be kept secure and not exposed in client-side code
