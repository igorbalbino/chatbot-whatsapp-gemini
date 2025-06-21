// leitor de qr code
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); // Mudança Buttons

const { GoogleGenAI } = require('@google/genai');
const key = 'AIzaSyDIDPcp3FQ4oOMxnU2-ZHvZA2nZCaPtwm4';
const ai = new GoogleGenAI({ apiKey: key });

const nodemailer = require('nodemailer');

const client = new Client();
// serviço de leitura do qr code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// apos isso ele diz que foi tudo certo
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

let history = [];
let initialized

async function promptAI(msg) {
	if(history.length > 10) history.shift();
	if(!history[msg.contact]) history[msg.contact] = [];
	if(history[msg.contact].length > 10) history[msg.contact].shift();
	
	history[msg.contact].push({ "role": "user", "parts": [{ "text": msg.body }]});
	
	const response = await ai.models.generateContent({
		model: "learnlm-2.0-flash-experimental",
		contents: history[msg.contact],
		config: {
			systemInstruction: "Seu nome é Yurika e você é um agente AI no papel de atendente de whatsapp para a empresa CREATIO (https://creatiotech.com.br). A Creatio oferece serviços de Desenvolvimento de Web e Android, Desenvolvimento de Chatbots e modelos de Machine Learning para Análise de Dados e LLMs, Serviço de Eletricista Residencial (https://denki.creatiotech.com.br), Aulas Particulares de Inglês com material próprio e método de imersão (https://instagram.com/fluently.focused) e Personal Trainer com acompanhamento Nutricional (https://nutriunt.blog). Quando entrarem em contato, seja sutil em descobrir o que querem e detalhes do que precisam, depois compile tudo em uma frase e confirme com o cliente se é isso mesmo o que precisa e pegue o email dele. Se ele confirmar, compile todas as informações em um texto detalhado e retorne seu próximo output com uma string no formatojson, apenas com o as {} e o conteúdo, não adicione mais nada a essa resposta: {'flag': 'SEND_MAIL', 'subject': detailed_subject, 'text': detailed_text, 'sender': costumer_email}. Sempre que o cliente tentar sair muito dos assuntos que a Creatio atende, volte sutilmente para os serviços que prestamos e tente, sutilmente, gerar venda.",
		}
	});
	
	history[msg.contact].push({ "role": "model", "parts": [{ "text": response.text}]});
	
	if(response.text.match('SEND_MAIL')) {
		console.log(response.text);
		let str_json = response.text.split('json')[1];
		
		// if(str_json.includes('`')) str_json = str_json.replaceAll('`','');
		
		let json = JSON.parse(str_json);
		
		let assunto = json.subject;
		let text = json.text;
		
		enviarEmail(json.sender, assunto, text);
		
		msg.body = 'teoricamente o email foi enviado. avise o cliente de que a equipe entraremos em contato para tratar o pedido dele em breve.';
		
		promptAI(msg);
	} else sendMessage(msg, response.text);
}

/*
async function initSupport(msg) {
	if(msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|opa|Opa|Ou|ou|ei|Ei|pia|Pia|Oui|oui)/i)) {
		const text = 'Olá! Sou o assistente virtual do Igor. Como posso ajudá-lo hoje? \nPor favor, digite uma das opções abaixo:\n\n1 - Eletricista\n2 - Inglês\n3 - Automação\n4 - Desenvolvimento de Software\n5 - Conversar com o robô';
		sendMessage(msg, text);
	}
	
	if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Faço pequenos reparo e adiciono pontos de tomadas, interruptores simples, interruptores paralelos, lâmpadas. Coloco Quadro de Distribuição de Circuitos, repasso cabos novos em casas com cabeamento antigo, conserto circuitos, coloco sensor de presensa, instalo e configuro aparelhos de casa inteligente (Alexa, Intelbras, Zigbee).');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Me conta exatamente o que ta precisando pra eu ver se consigo te passar um orçamento agora.');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Visita esse site para ter mais informações, caso precise: https://denki.creatiotech.com.br');


    }

    if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Trabalho com método de imersão e forneço material de apoio em PDF para guiá-lo pelo caminho que vamos trilhar. Teremos conversação desde o primeiro dia, para você já ir se acostumando e perdendo a vergonha de falar em público. Claro que haverão erros no início, mas é normal. Todo mundo fala alguma coisa errada quando estamos aprendendo um idioma novo!');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'As aulas podem ser online ou presencialmente. A aula avulsa é R$ 50.00, mas se fechar o mês com 2 aulas por semana, sai a R$ 45.00 cada aula, totalizando R$ 360.00 pelo mês. E aí, vamos começar ?');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Visita meu perfil para ter umas dicas legais e conteúdo poliglota para te ajudar a dominar vários idiomas ao mesmo tempo: https://instagram.com/fluently.focused');
    }

    if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) {
        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Automatizo atendimentos apenas para Whatsapp. Crio o chatbot de acordo com a demanda e posso colocá-lo para acionar outras aplicações, como disparar emails, agendamentos e etc.');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Para fazer sua automação, vou ter que marcar uma reunião contigo para entender exatamente o que precisa, se é viável de ser feito e te passar valores. Vou te colocar em contato com a Yurika para vocês marcarem uma data e horário para conversarmos OK ?!');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Enquanto isso, da uma olhada no meu site para ver se esse é o único serviço que te interessa ou se posso resolver mais alguma coisa para você: https://creatiotech.com.br');
		
		msg.body = 'Cliente demonstrou interesse em fazer uma automação para whatsapp. Descubra exatamente o que ele quer que a automação faça, compile todas as informações que ele te passar em um pequeno texto com um fluxograma e confirme com ele se é isso mesmo, para me passar já pronto. Diga que darei valores depois. Siga o atendimento a partir daqui como se estivesse acabando de chegar para atender o cliente.';
		await promptAI(msg);

    }
	
	if (msg.body !== null && msg.body === '4' && msg.from.endsWith('@c.us')) {
        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Desenvolvimento de aplicações WEB e Mobile personalizadas para suas necessidades. Tenho conhecimento em Linguagens: JavaScript, Java, PHP e Python; Gerenciador de Pacotes: Node; Frameworks: Laravel, CodeIgniter, VueJS');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Para fazer sua aplicação, vou ter que marcar uma reunião contigo para entender exatamente o que precisa, se é viável de ser feito e te passar valores. Vou te colocar em contato com a Yurika para vocês marcarem uma data e horário para conversarmos OK ?!');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Enquanto isso, da uma olhada no meu site para ver se esse é o único serviço que te interessa ou se posso resolver mais alguma coisa para você: https://creatiotech.com.br');
		
		msg.body = 'Cliente demonstrou interesse no desenvolvimento de uma aplicação. Descubra exatamente o que ele quer, compile todas as informações que ele te passar em um pequeno texto com um fluxograma e confirme com ele se é isso mesmo, para me passar já pronto. Diga que darei valores depois. Siga o atendimento a partir daqui como se estivesse acabando de chegar para atender o cliente.';
		await promptAI(msg);
    }

    if (msg.body !== null && msg.body === '5' && msg.from.endsWith('@c.us')) {
        msg.body = 'Oi.';
		await promptAI(msg);
    }
}
*/


// Configura o serviço de e-mail (exemplo com Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'igor.santo.comercial@gmail.com',
        pass: ''
    }
});

function enviarEmail(sender, assunto, texto) {
    const mailOptions = {
        from: 'igor.santo.comercial@gmail.com',
        to: 'igor.santo.comercial@gmail.com',
        subject: assunto,
        text: texto + ' Email do Cliente: ' + sender
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
}

async function sendMessage(msg, response) {
	const chat = await msg.getChat();

	await delay(3000); //delay de 3 segundos
	await chat.sendStateTyping(); // Simulando Digitação
	await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
	const contact = await msg.getContact(); //Pegando o contato
	const name = contact.pushname; //Pegando o nome do contato
	await client.sendMessage(msg.from, response); //Primeira mensagem de texto
	await delay(3000); //delay de 3 segundos
	// await chat.sendStateTyping(); // Simulando Digitação
	await delay(5000); //Delay de 5 segundos
}

// E inicializa tudo 
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

client.on('message', async msg => {
    if (msg.from.endsWith('@c.us')) {
        // await initSupport(msg);
		await promptAI(msg);
    }
});