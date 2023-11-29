const http = require('http');
const server = http.createServer(function(req, res){
    res.setHeader('Content-Type', 'application/json');

    res.setHeader('Access-Control-Allow-Origin', 'null'); // Change 'null' to the specific origin you want to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if(req.url === '/vendedores' && req.method === 'GET'){
        const vendedores = [
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
            // Adicione mais vendedores conforme necessário
        ];

        res.statusCode = 200;
        res.end(JSON.stringify(vendedores));
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Rota não encontrada' }));
    }
});

const PORT = 5000;
server.listen(PORT, function(){
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});