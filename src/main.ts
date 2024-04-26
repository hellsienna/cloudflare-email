import { Router } from 'itty-router';
import Email from './controllers/email';
import AuthMiddleware from './middlewares/auth';
import EmailSchemaMiddleware, { EmailRequest } from './middlewares/email';
import { IEmail } from './schema/email';

const router = Router();

// POST /api/email
router.post<EmailRequest>('/api/email', AuthMiddleware, EmailSchemaMiddleware, async (request, env) => {
	const email = request.email as IEmail;
	
	try {
		await Email.send(email, env);
	} catch (e) {
		console.error(`Error sending email: ${e}`);
		return new Response(`Internal Server Error | ${e}`, { status: 500 });
	}

	return new Response('OK', { status: 200 });
});

router.all('*', (request) => new Response('Not Found', { status: 404 }));

export default {
	fetch: (request: Request, env: Env) => router.handle(request, env),
};
