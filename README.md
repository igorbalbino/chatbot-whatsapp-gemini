# WhatsApp AI Chatbot

Este é um chatbot para WhatsApp integrado com a API do Google GenAI (Gemini), que responde automaticamente clientes interessados em:

- Aulas de inglês com metodologia de imersão (Igor - @fluently.focused)
- Serviços de eletricista
- Criação de chatbots e automações para WhatsApp

## Funcionalidades

- Leitura automática do QR Code para login no WhatsApp Web
- Atendimento automatizado com simulação de digitação
- Personalização com histórico por contato
- Interação com modelo de linguagem da Google (LearnLM)
- Suporte a múltiplos tipos de serviços com detecção automática

## Pré-requisitos

- Node.js instalado
- Conta Google com chave de API GenAI
- Conta no WhatsApp Web válida

## Instalação e Execução

1. Clone o repositório:
	```bash
	git clone <seu-repo-aqui>
	cd <pasta-do-projeto>```

2. Instalar os pacores
	```npm install```
	
3. Configure sua chave da API GenAI no código (substitua `'CHAVE_API'`).

4. Inicie o bot:
	```node chatbot.js```

5. Escaneie o QR Code com o WhatsApp Web.

Pronto! O bot estará ativo para responder automaticamente seus clientes.





Base:
peguei os arquivos de https://youtu.be/MdZFR2op_mg?si=rxgWaizPsQD3xZHc

usando a api do google gemini, versao experimental, para nao pagar.
https://ai.google.dev/gemini-api/docs/quickstart?lang=node&hl=pt-br
