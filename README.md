
# Itaú Boletos e Pix com Python & Flask

Esse software é um servidor back-end voltado a geração de boletos consumindo as API's do Itaú for developers... Esse repositório é privado por conter informações e dados confidenciais de cliente.

## Stack utilizada

**Linguagens:** Python

**Frameworks & Libs:** Flask, Flask_Cors, requests

## Arquitetura de Solução escolhida

![Arquitetura de Solução](https://i.ibb.co/cQ1HGKs/Architecture.png)

## Requisitos

- [Python 3.11.4 ou superior](https://www.python.org/downloads/)

## Instalação e rodando localmente

#### Acesse o diretório do projeto via terminal e utilize o seguinte comando para ativar o ambiente virtual do Python

```bash
  py -m venv venv
```

```bash
  .\venv\Scripts\activate
```

#### Quando a etapa de ativação for realizada, você verá no seu terminal (venv) antes do diretório que você se encontra, após isso, podemos começar com as instalações necessárias, use o comando seguinte para instalar

```bash
  py -m pip install -r requirements.txt
```

#### Depois disso, você poderá rodar o projeto com

```bash
  flask --app app.py --debug run
```

ou

```bash
  py -m flask --app .\app.py run
```

## Entrada de Dados

- Na rota principal `/bolecode` do tipo `POST`, você deverá usar um arquivo do tipo `JSON` no corpo que deve conter a seguinte formatação:

```
{
    etapa_processo_boleto: !String,
    beneficiario: {
        id_beneficiario: !String
    },
    dado_boleto: {
        tipo_boleto: !String,
        texto_seu_numero: !String,
        codigo_carteira: !String,
        valor_total_titulo: !String,
        codigo_especie: !String,
        data_emissao: !String,
        pagador: {
            pessoa: {
                nome_pessoa: !String,
                tipo_pessoa: {
                    codigo_tipo_pessoa: !String,
                    numero_cadastro_pessoa_fisica: !String
                }
            },
            endereco: {
                nome_logradouro: !String,
                nome_bairro: !String,
                nome_cidade: !String,
                sigla_UF: !String,
                numero_CEP: !String
            }
        },
        dados_individuais_boleto: [
            {
                numero_nosso_numero: !String,
                data_vencimento: !String,
                valor_titulo: !String,
                data_limite_pagamento: !String,
                texto_uso_beneficiario: !String
            }
        ],
        lista_mensagem_cobranca: [
            {
                mensagem: !String
            }
        ]
    },
    dados_qrcode: {
        chave: !String
    }
}
```

## Autor do Projeto

- Felipe Baptista
- <felipe.baptista06@gmail.com>
- <https://felps-dev.vercel.app/>
