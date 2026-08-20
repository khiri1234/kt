/*
  ADCB Cheque Writer — local sync server
  ---------------------------------------
  Run this on ONE PC (the one that stays on while both PCs are in use).
  It serves the cheque app itself and stores the shared archive in a
  local file called data.json, right next to this script.

  Requirements: Node.js installed (download from https://nodejs.org).
  No extra packages needed — just Node's built-in modules.

  To run:
    1. Put this file and index.html in the same folder.
    2. Open a terminal / Command Prompt in that folder.
    3. Run:  node server.js
    4. It will print the URLs to use on each PC.

  Keep the terminal window open while you want sync active.
*/

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 4890;
const DATA_FILE = path.join(__dirname, 'data.json');
const HTML_FILE = path.join(__dirname, 'index.html');

function readData(){
  try{
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      archive: Array.isArray(parsed.archive) ? parsed.archive : [],
      knownPayees: Array.isArray(parsed.knownPayees) ? parsed.knownPayees : []
    };
  }catch(e){
    return { archive: [], knownPayees: [] };
  }
}

function writeData(data){
  const safe = {
    archive: Array.isArray(data.archive) ? data.archive : [],
    knownPayees: Array.isArray(data.knownPayees) ? data.knownPayees : []
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(safe, null, 2));
  return safe;
}

// Make sure data.json exists from the start
if(!fs.existsSync(DATA_FILE)){
  writeData({ archive: [], knownPayees: [] });
}

const server = http.createServer((req, res) => {
  // Allow requests from any device on the network
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if(req.method === 'OPTIONS'){
    res.writeHead(204);
    res.end();
    return;
  }

  if(req.url === '/api/data' && req.method === 'GET'){
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(readData()));
    return;
  }

  if(req.url === '/api/data' && req.method === 'POST'){
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try{
        const incoming = JSON.parse(body);
        const saved = writeData(incoming);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ ok: true, saved }));
      }catch(e){
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
      }
    });
    return;
  }

  if(req.url === '/' || req.url === '/index.html'){
    fs.readFile(HTML_FILE, (err, content) => {
      if(err){
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Could not find index.html — make sure it is in the same folder as server.js');
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(content);
    });
    return;
  }

  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('Not found');
});

function getLanAddresses(){
  const interfaces = os.networkInterfaces();
  const addresses = [];
  Object.keys(interfaces).forEach(name => {
    interfaces[name].forEach(iface => {
      if(iface.family === 'IPv4' && !iface.internal){
        addresses.push(iface.address);
      }
    });
  });
  return addresses;
}

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('ADCB Cheque Writer sync server is running.');
  console.log('');
  console.log('On THIS PC, open:');
  console.log('  http://localhost:' + PORT);
  console.log('');
  const lanIps = getLanAddresses();
  if(lanIps.length){
    console.log('On the OTHER PC (same Wi-Fi / network), open:');
    lanIps.forEach(ip => console.log('  http://' + ip + ':' + PORT));
  }else{
    console.log('Could not detect a network address automatically.');
    console.log('Run "ipconfig" (Windows) or "ifconfig" (Mac/Linux) to find this PC\'s IPv4 address,');
    console.log('then open http://<that-address>:' + PORT + ' on the other PC.');
  }
  console.log('');
  console.log('Keep this window open while you want sync active. Press Ctrl+C to stop.');
  console.log('');
});
