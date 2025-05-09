// leitor de qr code
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); // Mudança Buttons

const { GoogleGenAI } = require('@google/genai');
const key = 'CHAVE_API';
const ai = new GoogleGenAI({ apiKey: key });


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

async function promptAI(msg) {
	if(history.length > 10) history.shift();
	if(!history[msg.contact]) history[msg.contact] = [];
	if(history[msg.contact].length > 10) history[msg.contact].shift();
	
	history[msg.contact].push({ "role": "user", "parts": [{ "text": msg.body }]});
	
	const response = await ai.models.generateContent({
		model: "learnlm-2.0-flash-experimental",
		contents: history[msg.contact],
		config: {
			systemInstruction: "Você é um agente AI que atende pessoas que entram em contato comigo para aulas de inglês. Dou aulas a 50 reais mas se fechar pacote de 1 mes com 2 aulas mensais, sai a 45 reais cada aula. Meu nome é Igor e meu instagram de negócios é o @fluently.focused. Meu método de ensino é por imersão e ofereço material de apoio em PDF. Aulas online ou presencial se for em BH. Foque em gerar venda mas não fique falando de preços toda hora. Também ofereço serviço de eletricista. Caso seja isso que o cliente esteja procurando, faça algumas perguntas e tente descobrir o que ele tem de problema e depois coloque todos os problemas em um pequeno texto e confirme com ele. Também faço chatbots e automação de atendimento no whatsapp, se for isso que o cliente quer, faça algumas perguntas para descobrir o que ele quer resolver, compile em um pequeno texto e confirme com ele. Se te tratar mau, apenas peça para esperar e diga que vou atendê-lo depois. Se mandar audio, fale que ainda nao escuta e nem manda audio, mas que vamos tratar isso depois.",
		}
	});
	
	history[msg.contact].push({ "role": "model", "parts": [{ "text": response.text}]});
	
	const chat = await msg.getChat();

	await delay(3000); //delay de 3 segundos
	await chat.sendStateTyping(); // Simulando Digitação
	await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
	const contact = await msg.getContact(); //Pegando o contato
	const name = contact.pushname; //Pegando o nome do contato
	await client.sendMessage(msg.from, response.text); //Primeira mensagem de texto
	await delay(3000); //delay de 3 segundos
	// await chat.sendStateTyping(); // Simulando Digitação
	await delay(5000); //Delay de 5 segundos
}

// E inicializa tudo 
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

// Funil

client.on('message', async msg => {
    if (msg.from.endsWith('@c.us')) {
        await promptAI(msg);
    }
});