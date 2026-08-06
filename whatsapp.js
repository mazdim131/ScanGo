const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const path = require("path");
const fs = require("fs");

let isReady = false;
let messageQueue = [];

function getChromePath() {
  const possiblePaths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    path.join(
      process.env.LOCALAPPDATA || "",
      "Google\\Chrome\\Application\\chrome.exe",
    ),
  ];

  for (const chromePath of possiblePaths) {
    if (fs.existsSync(chromePath)) {
      return chromePath;
    }
  }
  return null;
}

const chromeExecutable = getChromePath();

if (!chromeExecutable) {
  console.error("Google Chrome tidak ditemukan di folder Windows!");
  console.error("Silakan install Google Chrome terlebih dahulu, lalu jalankan lagi.");
  process.exit(1);
}

console.log("Menggunakan Chrome dari:", chromeExecutable);

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: chromeExecutable,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  },
});

client.on("qr", (qr) => {
  console.log("📱 Scan QR Code ini memakai WhatsApp HP kamu:");
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("WhatsApp berhasil diautentikasi!");
});

client.on("ready", () => {
  console.log("WhatsApp berhasil terhubung!");
  isReady = true;
  flushQueue();
});

client.on("auth_failure", (msg) => {
  console.error("Gagal autentikasi WhatsApp:", msg);
});

client.on("disconnected", (reason) => {
  console.log("WhatsApp terputus:", reason);
  isReady = false;
});

client.on("error", (err) => {
  console.error("Error WhatsApp Client:", err.message || err);
});

client.initialize();

function normalizePhoneNumber(number) {
  if (number === null || number === undefined) return null;

  let digits = String(number).replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("0")) {
    digits = "62" + digits.slice(1);
  } else if (digits.startsWith("8")) {
    digits = "62" + digits;
  } else if (!digits.startsWith("62")) {
    digits = "62" + digits;
  }

  return digits;
}

function sendWhatsAppMessage(to, message) {
  return new Promise((resolve, reject) => {
    const phone = normalizePhoneNumber(to);
    if (!phone) {
      const err = new Error(`Nomor WhatsApp tidak valid: "${to}"`);
      console.error(err.message);
      return reject(err);
    }

    const target = phone + "@c.us";

    const execute = () => {
      client
        .sendMessage(target, message)
        .then((res) => {
          console.log(`WhatsApp terkirim ke ${to} (${phone})`);
          resolve(res);
        })
        .catch((err) => {
          console.error(`Gagal kirim WhatsApp ke ${to}:`, err.message || err);
          reject(err);
        });
    };

    if (isReady) {
      execute();
    } else {
      console.log(`WhatsApp belum siap, pesan ke ${to} akan diantrekan...`);
      messageQueue.push(execute);
    }
  });
}

function flushQueue() {
  while (messageQueue.length) {
    const execute = messageQueue.shift();
    execute();
  }
}

module.exports = {
  client,
  sendWhatsAppMessage,
  isWhatsAppReady: () => isReady,
};
