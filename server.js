const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const apiKey = 'AQVNxFHeqzaG8Ueo2ciGndUugM97oOivvNs3p2KH';

app.use(express.static('public'));
app.use(express.json()); // Для обработки JSON
app.use(cors()); // Для разрешения CORS

io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data);
    });
});

app.post('/proxy', async (req, res) => {
    console.log('Получено тело запроса:', req.body);
    try {
        const response = await axios.post('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', req.body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Api-Key ${apiKey}`,
            },
        });
        console.log('Ответ от API:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Ошибка API:', error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
