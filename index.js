const http = require('http');
const url = require('url');

const PORT = 3000;
const DEFAULT_NUMBER_OF_WORDS = 100;

const getNRandom = array => number => {
	const subArray = [];

	for (let i = 0; i < number; i++) {
		const randomIndex = Math.floor(Math.random() * array.length);
		subArray.push(array[randomIndex]);
	}

	return subArray;
};

const toMB = number => number / 1024 / 1024;

http.createServer((req, res) => {
	if (req.url !== '/favicon.ico') {
		const t1 = performance.now();
		const { pathname, query: { n = DEFAULT_NUMBER_OF_WORDS } } = url.parse(req.url, true);

		if (pathname !== '/') {
			res.statusCode = 302;
			res.setHeader('Location', '/');
			res.end();
			return;
		}

		const words = require('./data/words.json');

		const getNRandomWords = getNRandom(words);

		res.writeHead(200, {"Content-Type": "application/json"});
		res.write(JSON.stringify({ data: getNRandomWords(n) }));

		const t2 = performance.now();
		console.log({
			timeToExecute: t2 - t1,
			memoryRss: toMB(process.memoryUsage().rss),
			memoryHeapTotal: toMB(process.memoryUsage().heapTotal),
			memoryHeapUsed: toMB(process.memoryUsage().heapUsed),
		});

		res.end();
	}
}).listen(PORT);
