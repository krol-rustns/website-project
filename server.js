const http = require('http');
const { parse } = require('querystring');

let vendedores = [
    {
        codigoVendedor: 1,
        nome: "Paulo Oliveira",
        cargo: "Pleno",
        codigoVenda: 2,
        valorVenda: 65889.00
    },
    {
        codigoVendedor: 4,
        nome: "carlos sanchez",
        cargo: "Júnior",
        codigoVenda: 10,
        valorVenda: 5.00
    },
    {
        codigoVendedor: 1,
        nome: "Paulo",
        cargo: "Pleno",
        codigoVenda: 16,
        valorVenda: 5.00
    },
    {
        codigoVendedor: 3,
        nome: "Laura Cardozo Alves",
        cargo: "Sênior",
        codigoVenda: 0o1,
        valorVenda: 2235000.00
    },
    {
        codigoVendedor: 1,
        nome: "Paulo Oliveira",
        cargo: "Pleno",
        codigoVenda: 5,
        valorVenda: 70889.00
    },
    {
        codigoVendedor: 2,
        nome: "Arnaldo dos Santos",
        cargo: "Júnior",
        codigoVenda: 4,
        valorVenda: 5102.00
    },
    {
        codigoVendedor: 4,
        nome: "Carlos Sánchez",
        cargo: "Júnior",
        codigoVenda: 3,
        valorVenda: 18655.00
    },
    {
        codigoVendedor: 2,
        nome: "arnaldo dos Santos",
        cargo: "Júnior",
        codigoVenda: 9,
        valorVenda: 2.00
    },
];

const server = http.createServer(function(req, res){
    res.setHeader('Content-Type', 'application/json');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if(req.url === '/vendas' && req.method === 'GET'){
        res.statusCode = 200;
        res.end(JSON.stringify(vendedores));
    } else if(req.url === '/vendas' && req.method === 'POST'){
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const novoVendedor = JSON.parse(body);

            // Adicionar o novo vendedor ao array de vendedores
            vendedores.push(novoVendedor);

            res.statusCode = 200;
            res.end(JSON.stringify(vendedores));
        });
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Rota não encontrada' }));
    }
});

const PORT = 5000;
server.listen(PORT, function(){
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});