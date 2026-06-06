function mostrarModo(modo) {
    document.getElementById('modo-numeros').classList.remove('ativo');
    document.getElementById('modo-amigo').classList.remove('ativo');

    document.getElementById('tab-numeros').classList.remove('active');
    document.getElementById('tab-amigo').classList.remove('active');

    if (modo === 'numeros') {
        document.getElementById('modo-numeros').classList.add('ativo');
        document.getElementById('tab-numeros').classList.add('active');
    } else {
        document.getElementById('modo-amigo').classList.add('ativo');
        document.getElementById('tab-amigo').classList.add('active');
    }
}



function sortear() {
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const de = parseInt(document.getElementById('de').value);
    const ate = parseInt(document.getElementById('ate').value);

    if (isNaN(quantidade) || isNaN(de) || isNaN(ate)) {
        mostrarMensagemNumeros(
            '⚠ Campos vazios',
            'Preencha todos os campos para realizar o sorteio.'
        );
        return;
    }

    if (quantidade <= 0) {
        mostrarMensagemNumeros(
            '⚠ Quantidade inválida',
            'A quantidade precisa ser maior que zero.'
        );
        return;
    }

    if (de >= ate) {
        mostrarMensagemNumeros(
            '⚠ Intervalo inválido',
            'O número inicial precisa ser menor que o número final.'
        );
        return;
    }

    if (quantidade > (ate - de + 1)) {
        mostrarMensagemNumeros(
            '⚠ Quantidade indisponível',
            'A quantidade de números é maior que o intervalo disponível.'
        );
        return;
    }

    const sorteados = [];

    while (sorteados.length < quantidade) {
        const numero = obterNumeroAleatorio(de, ate);

        if (!sorteados.includes(numero)) {
            sorteados.push(numero);
        }
    }

    sorteados.sort((a, b) => a - b);

    document.getElementById('resultado').innerHTML = `
        <div class="result-icon">
            <img src="img/treasure-chest.png" alt="">
        </div>

        <div class="result-text">
            <h2>Números sorteados</h2>

            <div class="result-numbers">
                ${sorteados.join(' - ')}
            </div>
        </div>
    `;

    criarParticulasMagicasNumeros();
    animarBauNumeros();
}

function obterNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function reiniciar() {
    document.getElementById('quantidade').value = '';
    document.getElementById('de').value = '';
    document.getElementById('ate').value = '';

    document.getElementById('resultado').innerHTML = `
        <div class="result-icon">
            <img src="img/treasure-chest.png" alt="">
        </div>

        <div class="result-text">
            <h2>Nenhum número sorteado ainda</h2>
            <p>Preencha os campos e clique em Sortear</p>
        </div>
    `;
}



let participantes = [];
let pares = [];
let indiceAtual = 0;
let sorteioFoiRevelado = false;

function adicionarParticipante() {
    const input = document.getElementById('nome-amigo');
    const nome = input.value.trim();

    if (!nome) {
        mostrarMensagemAmigo(
            '⚠ Nome vazio',
            'Digite o nome do participante para continuar.',
            '← Fechar',
            'mostrarCadastro()'
        );
        return;
    }

    if (participantes.includes(nome)) {
        mostrarMensagemAmigo(
            '⚠ Participante duplicado',
            'Esse participante já foi adicionado à lista.',
            '← Fechar',
            'mostrarCadastro()'
        );
        return;
    }

    participantes.push(nome);

    atualizarLista();

    input.value = '';
    input.focus();
}

function atualizarLista() {
    const lista = document.getElementById('lista-participantes');

    lista.innerHTML = '';

    participantes.forEach(nome => {
        const li = document.createElement('li');
        li.textContent = nome;

        lista.appendChild(li);
    });

    document.getElementById('titulo-participantes').textContent =
        `Participantes (${participantes.length})`;
}

function sortearAmigoSecreto() {
    if (participantes.length < 2) {
        mostrarMensagemAmigo(
            '⚠ Participantes insuficientes',
            'Adicione pelo menos 2 participantes para realizar o sorteio.',
            '← Fechar',
            'mostrarCadastro()'
        );
        return;
    }


    let sorteados;
    let valido = false;

    while (!valido) {
        sorteados = [...participantes];

        for (let i = sorteados.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sorteados[i], sorteados[j]] = [sorteados[j], sorteados[i]];
        }

        valido = participantes.every((pessoa, index) => {
            return pessoa !== sorteados[index];
        });
    }

    pares = [];

    for (let i = 0; i < participantes.length; i++) {
        pares.push({
            pessoa: participantes[i],
            amigo: sorteados[i]
        });
    }

    for (let i = pares.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pares[i], pares[j]] = [pares[j], pares[i]];
    }  

    indiceAtual = 0;
    sorteioFoiRevelado = false;

    document.querySelector('.lista-amigos').classList.add('esconder');

    document.getElementById('area-cadastro-amigo').classList.add('esconder');
    document.getElementById('area-botoes-amigo').classList.add('esconder');
    document.getElementById('btn-voltar-cadastro').classList.remove('esconder');

    mostrarParticipanteAtual();
}

function mostrarParticipanteAtual() {
    if (indiceAtual >= pares.length) {
        document.getElementById('resultado-amigo').innerHTML = `
            <div class="result-content-center">

                <div class="result-icon grande">
                    <img src="img/treasure-chest.png" alt="">
                </div>

                <h2>🎉 Sorteio Concluído!</h2>

                <p>
                    Todos os participantes já receberam
                    seus amigos secretos.
                </p>

                <button
                    class="btn-sortear btn-proximo"
                    onclick="reiniciarAmigoSecreto()">
                    ✨ Novo Sorteio
                </button>

            </div>
        `;

        criarParticulasMagicas();
        animarBau();

        return;
    }

    sorteioFoiRevelado = false;

    document.getElementById('resultado-amigo').innerHTML = `
        <div class="result-content-center">
            <div class="result-icon grande">
                <img src="img/treasure-chest.png" alt="">
            </div>

            <h2>Vez de:</h2>

            <div class="nome-destaque">
                ${pares[indiceAtual].pessoa}
            </div>

            <div class="linha-magica"></div>

            <p>Como deseja receber sua revelação?</p>

            <div class="opcoes-revelacao">
                <button class="btn-sortear" onclick="revelarAmigo()">
                    👁 Revelar no site
                </button>

                <button class="btn-reiniciar" onclick="pedirEmailParaEnviar()">
                    ✉ Receber por email
                </button>
            </div>
        </div>
    `;
}

function revelarAmigo() {
    if (pares.length === 0) {
        mostrarMensagemAmigo(
            '⚠ Sorteio não iniciado',
            'Faça o sorteio primeiro para revelar um amigo secreto.',
            '← Fechar',
            'mostrarCadastro()'
        );
        return;
    }

    if (indiceAtual >= pares.length) {
        return;
    }

    sorteioFoiRevelado = true;

    document.getElementById('resultado-amigo').innerHTML = `
        <div class="result-content-center">
            <div class="result-icon grande">
                <img src="img/treasure-chest.png" alt="">
            </div>

            <div class="nome-destaque">
                ${pares[indiceAtual].pessoa}
            </div>

            <div class="linha-magica"></div>

            <p>Seu amigo secreto é:</p>

            <div class="amigo-destaque">
                ${pares[indiceAtual].amigo}
            </div>

            <button
                class="btn-reiniciar btn-proximo"
                onclick="proximoParticipante()">
                → Próximo Participante
            </button>
        </div>
    `;

    criarParticulasMagicas();
    animarBau();
}

function pedirEmailParaEnviar() {
    if (pares.length === 0) {
        mostrarMensagemAmigo(
            '⚠ Sorteio não iniciado',
            'Faça o sorteio primeiro para enviar a revelação por email.',
            '← Fechar',
            'mostrarCadastro()'
        );
        return;
    }

    if (indiceAtual >= pares.length) {
        return;
    }

    const parAtual = pares[indiceAtual];

    document.getElementById('resultado-amigo').innerHTML = `
        <div class="result-content-center">
            <div class="result-icon grande">
                <img src="img/treasure-chest.png" alt="">
            </div>

            <h2>✉ Receber por email</h2>

            <p>${parAtual.pessoa}, digite o email para receber sua revelação:</p>

            <input
                type="email"
                id="email-revelacao"
                class="input-email-revelacao"
                placeholder="seuemail@gmail.com"
                autocomplete="email"
            >

            <div class="opcoes-revelacao">
                <button class="btn-reiniciar" onclick="enviarEmailDigitado()">
                    ➜ Enviar revelação
                </button>

                <button class="btn-sortear" onclick="mostrarParticipanteAtual()">
                    Cancelar
                </button>
            </div>

            <p class="email-aviso">
                🔒 Seu email será usado apenas para enviar esta revelação.
            </p>
        </div>
    `;

    const inputEmail = document.getElementById('email-revelacao');

    inputEmail.focus();

    inputEmail.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            enviarEmailDigitado();
        }
    });
}

async function enviarEmailDigitado() {
    if (pares.length === 0) {
        mostrarMensagemAmigo(
            '⚠ Sorteio não iniciado',
            'Faça o sorteio primeiro para enviar a revelação por email.',
            '← Fechar',
            'mostrarCadastro()'
        );
        return;
    }

    if (indiceAtual >= pares.length) {
        return;
    }

    const inputEmail = document.getElementById('email-revelacao');

    if (!inputEmail) {
        return;
    }

    const email = inputEmail.value.trim();

    if (!email) {
        mostrarMensagemAmigo(
            '⚠ Email vazio',
            'Digite um email para receber sua revelação.',
            '← Tentar novamente',
            'pedirEmailParaEnviar()'
        );
        return;
    }

    if (!validarEmail(email)) {
        mostrarMensagemAmigo(
            '⚠ Email inválido',
            'O endereço informado não parece ser um email válido.',
            '← Tentar novamente',
            'pedirEmailParaEnviar()'
        );
        return;
    }

    const parAtual = pares[indiceAtual];

    document.getElementById('resultado-amigo').innerHTML = `
        <div class="result-content-center">
            <div class="result-icon grande">
                <img src="img/treasure-chest.png" alt="">
            </div>

            <h2>Enviando email...</h2>

            <p>Aguarde um momento.</p>
        </div>
    `;

    criarParticulasMagicas();
    animarBau();

    try {
        const resposta = await fetch('https://sorteador-amigosecreto.onrender.com/enviar-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pessoa: parAtual.pessoa,
                amigo: parAtual.amigo,
                email: email
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao enviar email.');
        }

        document.getElementById('resultado-amigo').innerHTML = `
            <div class="result-content-center">
                <div class="result-icon grande">
                    <img src="img/treasure-chest.png" alt="">
                </div>

                <h2>Email enviado!</h2>

                <p>${parAtual.pessoa}, sua revelação foi enviada para:</p>

                <div class="result-email">
                    ${email}
                </div>

                <button
                    class="btn-reiniciar btn-proximo"
                    onclick="proximoParticipante()">
                    → Próximo Participante
                </button>
            </div>
        `;

        criarParticulasMagicas();
        animarBau();

    } catch (erro) {
        console.error(erro);

        document.getElementById('resultado-amigo').innerHTML = `
            <div class="result-content-center">
                <div class="result-icon grande">
                    <img src="img/treasure-chest.png" alt="">
                </div>

                <h2>Erro ao enviar email</h2>

                <p>Verifique se o servidor está rodando e tente novamente.</p>

                <button
                    class="btn-sortear btn-proximo"
                    onclick="pedirEmailParaEnviar()">
                    Tentar novamente
                </button>

                <button
                    class="btn-reiniciar btn-proximo"
                    onclick="mostrarParticipanteAtual()">
                    Voltar
                </button>
            </div>
        `;
    }
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function mostrarMensagemAmigo(titulo, mensagem, textoBotao, acaoBotao) {
    document.getElementById('resultado-amigo').innerHTML = `
        <div class="result-content-center">
            <div class="result-icon grande">
                <img src="img/treasure-chest.png" alt="">
            </div>

            <h2>${titulo}</h2>

            <p>${mensagem}</p>

            <button
                class="btn-reiniciar btn-proximo"
                onclick="${acaoBotao}">
                ${textoBotao}
            </button>
        </div>
    `;

    criarParticulasMagicas();
    animarBau();
}

function mostrarMensagemNumeros(titulo, mensagem) {
    document.getElementById('resultado').innerHTML = `
        <div class="result-icon">
            <img src="img/treasure-chest.png" alt="">
        </div>

        <div class="result-text">
            <h2>${titulo}</h2>
            <p>${mensagem}</p>
        </div>
    `;

    criarParticulasMagicasNumeros();
    animarBauNumeros();
}

function proximoParticipante() {
    indiceAtual++;

    mostrarParticipanteAtual();
}

function mostrarCadastro() {
    document.querySelector('.lista-amigos').classList.remove('esconder');

    document.getElementById('area-cadastro-amigo').classList.remove('esconder');
    document.getElementById('area-botoes-amigo').classList.remove('esconder');
    document.getElementById('btn-voltar-cadastro').classList.add('esconder');

    document.getElementById('resultado-amigo').innerHTML = `
        <div class="result-icon">
            <img src="img/treasure-chest.png" alt="">
        </div>

        <div class="result-text">
            <h2>Cadastro de participantes</h2>
            <p>Você pode adicionar novos nomes ou sortear novamente.</p>
        </div>
    `;
}

function reiniciarAmigoSecreto() {
    participantes = [];
    pares = [];
    indiceAtual = 0;
    sorteioFoiRevelado = false;

    document.getElementById('nome-amigo').value = '';

    document.querySelector('.lista-amigos').classList.remove('esconder');

    document.getElementById('area-cadastro-amigo').classList.remove('esconder');
    document.getElementById('area-botoes-amigo').classList.remove('esconder');
    document.getElementById('btn-voltar-cadastro').classList.add('esconder');

    atualizarLista();

    document.getElementById('resultado-amigo').innerHTML = `
        <div class="result-icon">
            <img src="img/treasure-chest.png" alt="">
        </div>

        <div class="result-text">
            <h2>Amigo secreto ainda não sorteado</h2>
            <p>Adicione os participantes para começar</p>
        </div>
    `;
}



function criarParticulasMagicas() {
    const resultado = document.getElementById('resultado-amigo');

    const particulasAntigas = resultado.querySelector('.magic-particles');

    if (particulasAntigas) {
        particulasAntigas.remove();
    }

    const particulas = document.createElement('div');

    particulas.className = 'magic-particles';

    particulas.innerHTML = `
        <span>✦</span>
        <span>✨</span>
        <span>✦</span>
        <span>⭐</span>
        <span>✨</span>
    `;

    resultado.appendChild(particulas);

    setTimeout(() => {
        particulas.remove();
    }, 1500);
}



document.getElementById('nome-amigo').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        adicionarParticipante();
    }
});

function animarBau() {
    const bau = document.querySelector('#resultado-amigo .result-icon img');

    if (!bau) return;

    bau.classList.remove('baú-magico');

    void bau.offsetWidth;

    bau.classList.add('baú-magico');
}

function animarBauNumeros() {
    const bau = document.querySelector('#resultado .result-icon img');

    if (!bau) return;

    bau.classList.remove('baú-magico');

    void bau.offsetWidth;

    bau.classList.add('baú-magico');
}

function criarParticulasMagicasNumeros() {
    const resultado = document.getElementById('resultado');

    const particulasAntigas = resultado.querySelector('.magic-particles');

    if (particulasAntigas) {
        particulasAntigas.remove();
    }

    const particulas = document.createElement('div');

    particulas.className = 'magic-particles';

    particulas.innerHTML = `
        <span>✦</span>
        <span>✨</span>
        <span>✦</span>
        <span>⭐</span>
        <span>✨</span>
    `;

    resultado.appendChild(particulas);

    setTimeout(() => {
        particulas.remove();
    }, 1500);
}