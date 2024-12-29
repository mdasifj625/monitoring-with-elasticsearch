import dotenv from 'dotenv';
dotenv.config();
import pino from 'pino'; // Pino logger library
import pinoElastic from 'pino-elasticsearch'; // Elasticsearch transport for Pino
import pretty from 'pino-pretty'; // Pretty formatter for console logs

// Determine the Elasticsearch node URL from the environment
// elasticsearchNode: string
const elasticsearchNode =
	process.env.ELASTICSEARCH_HOSTS || 'http://localhost:9200'; // Default to localhost if the environment variable is not set

// Pino multistream configuration
// transportStreams: array of stream objects, each with stream and level configuration
const transportStreams = pino.multistream([
	{
		// Pretty formatting for console logs
		level: 'info', // level: string
		stream: pretty({
			colorize: true,
			ignore: 'pid,hostname', // ignore: string
			translateTime: true, // translateTime: boolean
		}),
	},
	{
		// Elasticsearch transport for storing logs in Elasticsearch
		stream: pinoElastic({
			index: `monitoring_${process.env.NODE_ENV}`, // index: string -- serviceName_env
			node: elasticsearchNode, // node: string (Elasticsearch node URL)
			esVersion: 7, // esVersion: number (Elasticsearch version)
			flushBytes: 1000, // flushBytes: number (Data threshold to flush in one go)
		}),
	},
]);

// Logger configuration and initialization
// logger: pino.Logger
const logger = pino(
	{
		timestamp: pino.stdTimeFunctions.isoTime, // timestamp: function (Standard ISO time format function)
		formatters: {
			level(label, number) {
				return { level: label }; // level: function (Custom log level formatter)
			},
		},
	},
	transportStreams // transportStreams: Array (transport stream configuration)
);

// Making the logger a singleton to ensure consistent logging across the app
// singletonLogger: pino.Logger | null
let singletonLogger = null;

/**
 * getLogger: function that returns the singleton logger instance
 * @returns {import('pino').Logger}
 */
const getLogger = () => {
	if (!singletonLogger) {
		singletonLogger = logger; // Store the first instance if not already created
	}
	return singletonLogger; // Return the singleton logger instance
};

// Export the singleton logger getter function
export default getLogger();
