const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 CREDENCIAIS EFÍ
const client_id = "SEU_CLIENT_ID";
const client_secret = "SEU_CLIENT_SECRET";
const chave_pix = "silvaereisrepresentacao@gmail.com";

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
        chave: chave_pix,
        solicitacaoPagador: "FluxoZap - Assinatura"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const loc = response.data.loc.id;
    const txid = response.data.txid;

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
      txid: txid
    });

  } catch (err) {
    console.log(err.response?.data || err);
    res.status(500).send("Erro ao gerar Pix");
  }
});

// 🔎 CONSULTAR STATUS REAL DO PIX
app.get("/status/:txid", async (req, res) => {

  try{

    const txid = req.params.txid;

    const token = await gerarToken();

    const response = await axios.get(
      `https://pix.api.efipay.com.br/v2/cob/${txid}`,
      {
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json({
      status: response.data.status
    });

  }catch(err){
    console.log(err.response?.data || err);
    res.status(500).send("Erro ao consultar status");
  }

});

// 🔔 WEBHOOK (OPCIONAL MAS IDEAL)
app.post("/webhook", (req, res) => {

  console.log("Pagamento confirmado webhook:", req.body);

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("🔥 Backend Pix rodando na porta 3000");
});
