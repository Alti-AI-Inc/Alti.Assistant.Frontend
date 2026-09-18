/* eslint-disable no-console */
// Simple HTTPS proxy that forwards incoming HTTPS requests to a local HTTP Next dev server
// Usage: node scripts/dev-https-proxy.js --cert ./certs/localhost.pem --key ./certs/localhost-key.pem --listen 3443 --target http://localhost:3000

const https = require('https');
const fs = require('fs');
const { createProxyServer } = require('http-proxy');
const argv = require('minimist')(process.argv.slice(2));

const certPath = argv.cert || './certs/localhost.pem';
const keyPath = argv.key || './certs/localhost-key.pem';
const listenPort = argv.listen || 3443;
const target = argv.target || 'http://localhost:3000';

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.error(
    'Cert or key not found. Generate them with mkcert and place in ./certs',
  );
  console.error('Example mkcert commands:');
  console.error('  mkcert -install');
  console.error(
    '  mkcert -cert-file ./certs/localhost.pem -key-file ./certs/localhost-key.pem localhost 127.0.0.1 ::1',
  );
  process.exit(1);
}

const proxy = createProxyServer({ target, changeOrigin: true, ws: true });

proxy.on('error', (err, req, res) => {
  console.error('Proxy error', err);
  if (!res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
  }
  res.end('Bad gateway. Proxy error.');
});

const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

const server = https.createServer(options, (req, res) => {
  proxy.web(req, res);
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

server.listen(listenPort, () => {
  console.log(
    `HTTPS proxy listening on https://localhost:${listenPort} -> ${target}`,
  );
  console.log(
    'Make sure your browser trusts the local CA (use mkcert -install)',
  );
});
