import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import qrcode from 'qrcode-terminal';

// --- CONFIGURATION ---
const NGROK_TOKEN = "36VgyIN6Q2OyvICWiXDa1mDuyyq_7V3BJFn4g794yo2cdrTYC"; // Optional: Hardcode your token here if env var fails

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NGROK_CONFIG_PATH = path.join(__dirname, 'ngrok-temp-config.yml');
const ENV_FILE_PATH = path.join(__dirname, '.env.local');

// --- 1. CLEANUP PREVIOUS RUNS ---
if (fs.existsSync(NGROK_CONFIG_PATH)) fs.unlinkSync(NGROK_CONFIG_PATH);

console.log('\x1b[36m%s\x1b[0m', '🎣 Fishing Contest: Starting Remote Tunnel Mode (DEBUG MODE)...');

// --- 2. START BACKEND SERVER ---
console.log('1️⃣  Starting Backend Server (Port 3001)...');
const backendProcess = spawn('node', ['server.js'], { stdio: 'pipe' });

// DEBUG: Print ALL Backend Output
backendProcess.stdout.on('data', (data) => {
    const output = data.toString();
    // process.stdout.write(`[BACKEND] ${output}`); // Uncomment to see raw logs

    // Wait for server to be ready before proceeding
    if (output.includes('HOST SERVER RUNNING')) {
        console.log('✅ Backend Server is Ready!');
        startTunnels();
    }
});

backendProcess.stderr.on('data', (data) => {
    console.error(`\x1b[31m[BACKEND ERROR]: ${data}\x1b[0m`);
});

// --- 3. START NGROK TUNNELS ---
function startTunnels() {
    console.log('2️⃣  Initializing Ngrok Tunnels (Frontend + Backend)...');

    const token = NGROK_TOKEN || process.env.NGROK_AUTHTOKEN;
    const authTokenConfig = token ? `authtoken: ${token}` : '';

    if (!token) {
        console.log('\x1b[33m%s\x1b[0m', '⚠️  WARNING: No Ngrok Authtoken detected. (Check NGROK_TOKEN in script)');
    }

    const ngrokConfig = `
version: "2"
${authTokenConfig}
tunnels:
  backend:
    addr: 3001
    proto: http
  frontend:
    addr: 5173
    proto: http
`;

    fs.writeFileSync(NGROK_CONFIG_PATH, ngrokConfig);

    // Start Ngrok
    const ngrokProcess = spawn('ngrok', ['start', '--all', `--config=${NGROK_CONFIG_PATH}`, '--log=stdout']);

    let backendUrl = '';
    let frontendUrl = '';
    let isConfigured = false;

    // DEBUG: Print ALL Ngrok Output
    ngrokProcess.stdout.on('data', (data) => {
        const logChunk = data.toString();
        // process.stdout.write(`[NGROK] ${logChunk}`); // Uncomment to see raw logs

        const lines = logChunk.split('\n');

        lines.forEach(line => {
            const urlMatch = line.match(/url=(https:\/\/[a-z0-9-]+\.ngrok[-a-z0-9]*\.app)/);

            if (urlMatch) {
                const url = urlMatch[1];

                if (line.includes('name=backend') || line.includes('addr=3001')) {
                    if (backendUrl !== url) {
                        backendUrl = url;
                        console.log(`   👉 Backend Tunnel Found: ${backendUrl}`);
                    }
                } else if (line.includes('name=frontend') || line.includes('addr=5173')) {
                    if (frontendUrl !== url) {
                        frontendUrl = url;
                        console.log(`   👉 Frontend Tunnel Found: ${frontendUrl}`);
                    }
                }

                if (backendUrl && frontendUrl && backendUrl !== frontendUrl && !isConfigured) {
                    isConfigured = true;
                    configureAndStartFrontend(backendUrl, frontendUrl);
                }
            }
        });
    });

    ngrokProcess.stderr.on('data', (data) => {
        const errorMsg = data.toString();
        console.error(`\x1b[31m[NGROK ERROR]: ${errorMsg}\x1b[0m`);
    });

    ngrokProcess.on('error', (err) => {
        if (err.code === 'ENOENT') {
            console.error('\x1b[31m%s\x1b[0m', '❌ Error: "ngrok" command not found.');
            console.log('   Please install ngrok and add it to your PATH, or npm install -g ngrok');
        } else {
            console.error('Failed to start ngrok:', err);
        }
        process.exit(1);
    });

    // Fallback cleanup
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down...');
        if (fs.existsSync(NGROK_CONFIG_PATH)) fs.unlinkSync(NGROK_CONFIG_PATH);
        ngrokProcess.kill();
        backendProcess.kill();
        process.exit();
    });
}

// --- 4. CONFIGURE & START FRONTEND ---
function configureAndStartFrontend(backendUrl, frontendUrl) {
    console.log('3️⃣  Configuring Frontend Environment...');

    const envContent = `VITE_API_BASE_URL=${backendUrl}/api`;
    fs.writeFileSync(ENV_FILE_PATH, envContent);

    console.log('4️⃣  Starting Frontend (Vite)...');

    // Start Vite
    const frontendProcess = spawn('npm', ['run', 'dev'], { stdio: 'ignore' });

    console.log('\n✅ SYSTEM ONLINE!');
    console.log('   Scan this QR Code with your phone to join:');
    console.log('   ------------------------------------------');

    qrcode.generate(frontendUrl, { small: true });

    console.log(`   📱 Public App URL: ${frontendUrl}`);
    console.log(`   🔧 Public API URL: ${backendUrl}/api`);
    console.log('\n   (Press Ctrl+C to stop all services)');
}