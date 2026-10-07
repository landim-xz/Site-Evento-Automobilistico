const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path'); // Módulo adicionado para lidar com pastas

const app = express();

// 1. Agora o Node sabe que os ficheiros visuais estão na subpasta "HTML Evento"
app.use(express.static(path.join(__dirname, 'HTML Evento')));
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database('evento.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS inscricoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            tipo_ingresso TEXT NOT NULL,
            data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

app.post('/cadastrar', (req, res) => {
    const { nome, email, 'tipo-ingresso': tipo_ingresso } = req.body;

    const query = `INSERT INTO inscricoes (nome, email, tipo_ingresso) VALUES (?, ?, ?)`;
    
    db.run(query, [nome, email, tipo_ingresso], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Erro ao guardar na base de dados.");
        }
        
        // 2. Redireciona para o ficheiro que agora ele sabe que está na pasta HTML Evento
        res.redirect('/confirmacao.html');
    });
});

app.listen(3000, () => {
    console.log('Servidor a correr na porta 3000 e a ler a pasta HTML Evento');
});