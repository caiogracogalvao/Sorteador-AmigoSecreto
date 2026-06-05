const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/enviar-email', async (req, res) => {
    const { pessoa, amigo, email } = req.body;

    try {
        await transporter.sendMail({
            from: `"Sorteio Mágico" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🎁 Sua revelação do Amigo Secreto',
            html: `
                <div style="
                    margin: 0;
                    padding: 0;
                    background: #050505;
                    font-family: Arial, sans-serif;
                    color: #ffffff;
                ">
                    <div style="
                        max-width: 560px;
                        margin: 0 auto;
                        padding: 32px 22px;
                        background: linear-gradient(180deg, #111111, #050505);
                        border: 1px solid #d7a23a;
                        border-radius: 14px;
                        text-align: center;
                    ">
                        <h1 style="
                            color: #d7a23a;
                            font-size: 32px;
                            margin-bottom: 8px;
                        ">
                            ✨ Sorteio Mágico ✨
                        </h1>

                        <p style="
                            color: #d6d6d6;
                            font-size: 17px;
                            margin-bottom: 26px;
                        ">
                            Olá, <strong style="color: #ffffff;">${pessoa}</strong>!
                        </p>

                        <div style="
                            border-top: 1px solid #d7a23a;
                            border-bottom: 1px solid #d7a23a;
                            padding: 24px 0;
                            margin-bottom: 24px;
                        ">
                            <p style="
                                color: #d6d6d6;
                                font-size: 18px;
                                margin: 0 0 12px;
                            ">
                                Seu amigo secreto é:
                            </p>

                            <h2 style="
                                color: #ffd46a;
                                font-size: 42px;
                                margin: 0;
                                text-shadow: 0 0 10px rgba(215, 162, 58, 0.45);
                            ">
                                ${amigo}
                            </h2>
                        </div>

                        <p style="
                            color: #ffffff;
                            font-size: 16px;
                            line-height: 1.6;
                            margin-bottom: 18px;
                        ">
                            Guarde esse segredo com carinho e prepare uma surpresa especial. 🎄🎁
                        </p>

                        <p style="
                            color: #a9a9a9;
                            font-size: 13px;
                            margin-top: 26px;
                        ">
                            Este email foi enviado automaticamente pelo Sorteio Mágico.
                        </p>
                    </div>
                </div>
            `
        });

        res.json({
            sucesso: true,
            mensagem: 'Email enviado com sucesso!'
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao enviar email.'
        });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});