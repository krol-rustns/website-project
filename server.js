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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
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
    } else if(req.url.startsWith('/vendas/') && req.method === 'PUT'){
        const codigoVenda = req.url.split('/')[2];

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const dadosAtualizados = JSON.parse(body);

            // Encontrar a venda pelo código da venda
            const vendaAtualizadaIndex = vendedores.findIndex(v => v.codigoVenda === parseInt(codigoVenda, 10));

            if (vendaAtualizadaIndex !== -1) {
                // Obter o código do vendedor associado à venda que está sendo atualizada
                const codigoVendedorAtualizado = vendedores[vendaAtualizadaIndex].codigoVendedor;

                // Atualizar todas as vendas com o mesmo código de vendedor, exceto o valorVenda
                vendedores.forEach((v, i) => {
                    if (v.codigoVendedor === codigoVendedorAtualizado) {
                        vendedores[i] = { ...v, ...dadosAtualizados };
                        vendedores[i].valorVenda = v.codigoVenda === parseInt(codigoVenda, 10) ? dadosAtualizados.valorVenda : v.valorVenda;
                    }
                });

                res.statusCode = 200;
                res.end(JSON.stringify(vendedores));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Venda não encontrada' }));
            }
        });
    } else if(req.url.startsWith('/vendas/') && req.method === 'DELETE'){
        const codigoVenda = req.url.split('/')[2];
    
        // Encontrar a venda pelo código da venda
        const vendaIndex = vendedores.findIndex(v => v.codigoVenda === parseInt(codigoVenda, 10));
    
        if (vendaIndex !== -1) {
            // Remover a venda encontrada
            vendedores.splice(vendaIndex, 1);
    
            res.statusCode = 200;
            res.end(JSON.stringify(vendedores));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Venda não encontrada' }));
        }
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Rota não encontrada' }));
    }
});

const PORT = 5000;
server.listen(PORT, function(){
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});