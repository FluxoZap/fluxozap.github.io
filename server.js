const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 SUAS CREDENCIAIS EFÍ
const client_id = "SEU_CLIENT_ID";
const client_secret = "SEU_CLIENT_SECRET";

// 🔑 GERAR TOKEN
async function gerarToken() {
  const res = await axios.post(
    "https://pix.api.efipay.com.br/oauth/token",
    { grant_type: "client_credentials" },
    {
      auth: {
        username: client_id,
        password: client_secret
      }
    }
  );
  return res.data.access_token;
}

// 💳 CRIAR PIX
app.post("/criar-pix", async (req, res) => {
  try {

    const { plano } = req.body;
    const valor = plano === "pro" ? 19.90 : 49.90;

    const token = await gerarToken();

    const response = await axios.post(
      "https://pix.api.efipay.com.br/v2/cob",
      {
        calendario: { expiracao: 3600 },
        valor: { original: valor.toFixed(2) },
        chave: "SEU_PIX_AQUI",
        solicitacaoPagador: "FluxoZap - Assinatura"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const loc = response.data.loc.id;

    const qr = await axios.get(
      `https://pix.api.efipay.com.br/v2/loc/${loc}/qrcode`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json({
      qrCode: qr.data.imagemQrcode,
      txid: response.data.txid
    });

  } catch (err) {
    console.log(err.response?.data || err);
    res.status(500).send("Erro Pix");
  }
});

// 🔔 WEBHOOK (CONFIRMAÇÃO)
app.post("/webhook", (req, res) => {
  console.log("Pagamento recebido:", req.body);

  // 👉 aqui você libera o plano no banco

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("🔥 Backend rodando na porta 3000");
});
