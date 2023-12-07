const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite3', (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Conexão com o banco de dados estabelecida.');
    }
});
const { parse } = require('querystring');

//let vendedores = [];

db.serialize(() => {
    // Crie a tabela se não existir
    db.run(`
        CREATE TABLE IF NOT EXISTS vendas (
            codVendedor INTEGER,
            nomeVendedor TEXT,
            cargoVendedor TEXT,
            codVenda INTEGER PRIMARY KEY,
            valorVenda REAL
        )
    `);

    db.get('SELECT COUNT(*) as count FROM vendas', (err, result) => {
        if (err) {
            console.error('Erro ao verificar se a tabela está vazia:', err.message);
        } else {
            const rowCount = result.count;
    
            // Se a tabela está vazia, execute o código de inserção
            if (rowCount === 0) {
                db.run(`
                    INSERT INTO vendas (codVendedor, nomeVendedor, cargoVendedor, valorVenda)
                    VALUES
                        (3, 'Laura Cardozo Alves', 'Sênior', 2235000.00),
                        (8, 'Paulo Oliveira', 'Pleno', 65889.00),
                        (4, 'Carlos Sánchez', 'Júnior', 18655.00),
                        (5, 'Arnaldo dos Santos', 'Júnior', 5102.00),
                        (6, 'Raquel Dourado', 'Pleno', 35521.00),
                        (6, 'Raquel Dourado', 'Pleno', 14323.00),
                        (4, 'Carlos Sánchez', 'Júnior', 4500.00),
                        (6, 'Raquel Dourado', 'Pleno', 35521.00),
                        (7, 'Luana Fernandes', 'Júnior', 3800.00),
                        (8, 'Paulo Oliveira', 'Pleno', 78000.00)
                `, (insertErr) => {
                    if (insertErr) {
                        console.error('Erro ao inserir dados na tabela:', insertErr.message);
                    } else {
                        console.log('Dados inseridos com sucesso.');
                    }
                });
            } else {
                console.log('A tabela já contém dados. Nenhuma inserção foi realizada.');
            }
        }
    });
});

const server = http.createServer(function(req, res){
    res.setHeader('Content-Type', 'application/json');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if(req.url === '/vendas' && req.method === 'GET'){
        db.all('SELECT * FROM vendas', [], (err, rows) => {
            if (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Erro ao buscar as vendas no banco de dados' }));
            } else {
                res.statusCode = 200;
                res.end(JSON.stringify(rows));
            }
        });
    } else if(req.url === '/vendas' && req.method === 'POST'){
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const novaVenda = JSON.parse(body);

            db.run('INSERT INTO vendas (codVendedor, nomeVendedor, cargoVendedor, valorVenda) VALUES (?, ?, ?, ?)', [novaVenda.codigoVendedor, novaVenda.nome, novaVenda.cargo, novaVenda.valorVenda], function (err) {
                if (err) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Erro ao inserir a venda no banco de dados' }));
                } else {
                    // Após a inserção, retorne os dados atualizados
                    db.all('SELECT * FROM vendas', [], (err, rows) => {
                        if (err) {
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: 'Erro ao buscar as vendas no banco de dados' }));
                        } else {
                            res.statusCode = 200;
                            res.end(JSON.stringify(rows));
                        }
                    });
                }
            });
        });
    } else if(req.url.startsWith('/vendas/') && req.method === 'PUT'){
        const codigoVenda = req.url.split('/')[2];

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const dadosAtualizados = JSON.parse(body);

            db.serialize(() => {
                // Iniciar uma transação
                db.run('BEGIN TRANSACTION');
            
                // Atualizar a venda específica
                db.run('UPDATE vendas SET codVendedor=?, nomeVendedor=?, cargoVendedor=?, valorVenda=? WHERE codVenda=?', [dadosAtualizados.codigoVendedor, dadosAtualizados.nome, dadosAtualizados.cargo, dadosAtualizados.valorVenda, codigoVenda], function (err) {
                    if (err) {
                        // Se houver um erro, rollback da transação e retorne um erro
                        db.run('ROLLBACK');
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Erro ao atualizar a venda no banco de dados' }));
                    }
                });
            
                // Atualizar outras vendas com o mesmo codigoVendedor, exceto a venda específica
                db.run('UPDATE vendas SET codVendedor=?, nomeVendedor=?, cargoVendedor=? WHERE codVenda<>? AND codVendedor=?', [dadosAtualizados.codigoVendedor, dadosAtualizados.nome, dadosAtualizados.cargo, codigoVenda, dadosAtualizados.codigoAntigo], function (err) {
                    if (err) {
                        // Se houver um erro, rollback da transação e retorne um erro
                        db.run('ROLLBACK');
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Erro ao atualizar outras vendas no banco de dados' }));
                    }
                });
            
                // Finalizar a transação
                db.run('COMMIT', function (err) {
                    if (err) {
                        // Se houver um erro, rollback da transação e retorne um erro
                        db.run('ROLLBACK');
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Erro ao finalizar a transação no banco de dados' }));
                    } else {
                        db.all('SELECT * FROM vendas', [], (err, rows) => {
                            if (err) {
                                res.statusCode = 500;
                                res.end(JSON.stringify({ error: 'Erro ao buscar as vendas no banco de dados' }));
                            } else {
                                res.statusCode = 200;
                                res.end(JSON.stringify(rows));
                            }
                        });
                    }
                });
            });
        });
    
    } else if(req.url.startsWith('/vendas/') && req.method === 'DELETE'){
        const codigoVenda = req.url.split('/')[2];
    
        db.run('DELETE FROM vendas WHERE codVenda=?', [codigoVenda], function (err) {
            if (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Erro ao excluir a venda do banco de dados' }));
            } else {
                db.all('SELECT * FROM vendas', [], (err, rows) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Erro ao buscar as vendas no banco de dados' }));
                    } else {
                        res.statusCode = 200;
                        res.end(JSON.stringify(rows));
                    }
                });
            }
        });
    
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Rota não encontrada' }));
    }
});

const PORT = 5000;

// Lidar com SIGINT (Ctrl+C) para encerrar o servidor corretamente
process.on('SIGINT', () => {
    console.log('\nRecebido SIGINT. Encerrando o servidor...');
    
    // Adicione qualquer lógica de encerramento necessária aqui

    // Encerrar o servidor
    server.close(() => {
        console.log('Servidor encerrado.');

        // Adicionar lógica para fechar a conexão com o banco de dados
        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar o banco de dados:', err.message);
            } else {
                console.log('Conexão com o banco de dados fechada.');
            }

            // Feche qualquer outra coisa que você precise encerrar
            process.exit(0);
        });
    });
});

server.listen(PORT, function(){
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});