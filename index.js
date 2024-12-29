import dotenv from 'dotenv';
dotenv.config();
import apmNode from 'elastic-apm-node';
import express from 'express';
import logger from './logger.js';
apmNode.start({
	serviceName: 'app-server',
	serverUrl: process.env.APM_SERVER_HOST,
	environment: 'development',
	captureBody: 'all',
	captureHeaders: true,
	captureExceptions: true,
	secretToken: process.env.APM_SECRET_TOKEN, // Optional, set only if you configured a secret token in APM Server
});

const app = express();
const PORT = 3000;

// Middleware to simulate a delay
app.use((req, res, next) => {
	logger.warn('simulating some delay on every request...');
	setTimeout(() => {
		next();
	}, Math.floor(Math.random() * 500) + 100); // Random delay between 100-500ms
});

// Route to simulate a normal request
app.get('/', (req, res) => {
	res.send({ message: 'Hello from APM Test App!', status: 'success' });
});

// Route to sample users data
app.get('/users', async (req, res) => {
	logger.info('Making api call to users.');
	fetch('https://reqres.in/api/users?page=1', { method: 'GET' })
		.then((apiResp) => {
			logger.info('received users data from api');
			apiResp
				.json()
				.then((jsonData) => {
					res.send(jsonData);
				})
				.catch((error) => {
					logger.error(error, 'JSON_parsing_issue');
					res.send({
						status: 'error',
						message: 'json_parsing_failed',
					});
				});
		})
		.catch((error) => {
			logger.error(error, 'user_api_call_issue');
			res.send({ status: 'error', message: 'some_internal_error' });
		});
});

// Route to simulate an error
app.get('/error', (req, res) => {
	logger.error('simulating error on /error');
	throw new Error('Simulated error for APM');
});

// Start the server
app.listen(PORT, () => {
	logger.info(`Server is running on port ${PORT}`);
});
