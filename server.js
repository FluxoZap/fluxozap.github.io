const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// SIMULAÇÃO PIX (trocar pela API do banco depois)
app.post('/criar-pix', (req, res) => {

  const { plano } = req.body;

  let valor = plano === "pro" ? 19.90 : 49.90;

  res.json({
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PIX-"+plano,
    valor: valor,
    txid: "123456"
  });

});

// WEBHOOK (CONFIRMA PAGAMENTO)
app.post('/webhook', (req, res) => {

  console.log("Pagamento confirmado:", req.body);

  // aqui você liberaria o plano no banco de dados

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
