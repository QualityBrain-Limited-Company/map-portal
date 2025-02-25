const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const path = require('path');
const port = process.env.PORT || 3000;

app.prepare().then(() => {
    const server = express();

    // ตั้งค่าเสิร์ฟไฟล์ static จากโฟลเดอร์ public/images
    server.use('/images', express.static(path.join(__dirname, 'public/images')));
    
    // ตั้งค่าเสิร์ฟไฟล์ static จากโฟลเดอร์ public/img
    server.use('/img', express.static(path.join(__dirname, 'public/img')));

    // เพิ่มการตั้งค่าสำหรับโฟลเดอร์ procurement
    server.use('/procurement/cover', express.static(path.join(__dirname, 'public/procurement/cover')));
    server.use('/procurement/pdf', express.static(path.join(__dirname, 'public/procurement/pdf')));
    server.use('/procurement/pdf-announced', express.static(path.join(__dirname, 'public/procurement/pdf-announced')));

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});