from flask import Flask, request, render_template, json
from flask_cors import CORS
from datetime import datetime
import requests

app = Flask(__name__)
CORS(app)


# REQUISITOS OBRIGATÓRIOS PARA AS FUNCIONALIDADES
# -> CLIENT_ID
# -> CLIENT_SECRET
# -> CERTIFICATE
# -> PRIVATE_KEY


cert = ('CERTIFICATE_SRC_PATH',
        'PRIVATE_KEY_SRC_PATH')


@app.route("/")
def home():
    return render_template('documentation.html')


@app.route("/bolecode", methods=['POST'])
def main():
    payload = request.get_json()

    token = createAcessToken()
    AccessToken = token["access_token"]

    payslip = createPayslip(AccessToken, payload)

    payslip['data']['dado_boleto']['data_emissao'] = toDateConverter(
        payslip['data']['dado_boleto']['data_emissao'])
    payslip['data']['dado_boleto']['dados_individuais_boleto'][0]['data_vencimento'] = toDateConverter(
        payslip['data']['dado_boleto']['dados_individuais_boleto'][0]['data_vencimento'])
    payslip['data']['dado_boleto']['dados_individuais_boleto'][0]['valor_titulo'] = toMoneyConverter(
        payslip['data']['dado_boleto']['dados_individuais_boleto'][0]['valor_titulo'])

    return result(payslip)


@app.route("/bolecode/run-test-json", methods=['GET'])
def runJson():
    token = createAcessToken()
    AccessToken = token["access_token"]

    with open('./src/json/data-example.json', 'r') as file:
        payload = json.load(file)

    payslip = createPayslip(AccessToken, payload)

    return payslip


@app.route("/bolecode/run-test-boleto", methods=['GET'])
def runBoleto():
    with open('./src/json/data-example.json', 'r') as file:
        payload = json.load(file)

    token = createAcessToken()
    AccessToken = token["access_token"]

    payslip = createPayslip(AccessToken, payload)

    payslip['data']['dado_boleto']['data_emissao'] = toDateConverter(
        payslip['data']['dado_boleto']['data_emissao'])
    payslip['data']['dado_boleto']['dados_individuais_boleto'][0]['data_vencimento'] = toDateConverter(
        payslip['data']['dado_boleto']['dados_individuais_boleto'][0]['data_vencimento'])
    payslip['data']['dado_boleto']['dados_individuais_boleto'][0]['valor_titulo'] = toMoneyConverter(
        payslip['data']['dado_boleto']['dados_individuais_boleto'][0]['valor_titulo'])

    return result(payslip)


@app.route("/bolecode/acesstoken", methods=['GET'])
def createAcessToken():
    url = "https://sts.itau.com.br/api/oauth/token"
    payload = 'grant_type=client_credentials&client_id={{CLIENT_ID}}&client_secret={{CLIENT_SECRET}}'
    headers = {
        'x-itau-flowID': "1",
        'x-itau-correlationID': "2",
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(url=url, data=payload, headers=headers, cert=cert)

    if 200 != response.status_code:
        print(response.headers)

    return response.json()


def createPayslip(AccessToken, data):
    url = "https://secure.api.itau/pix_recebimentos_conciliacoes/v2/boletos_pix"
    headers = {
        'Authorization': 'Bearer ' + AccessToken,
        'x-itau-flowID': '1234',
        'x-itau-correlationID': '1234',
        'Content-Type': 'application/json'
    }

    response = requests.post(url, json=data, headers=headers, cert=cert)
    if 200 != response.status_code:
        print(response.headers)

    return response.json()


def toMoneyConverter(value):
    toInt = int(value)/100
    formated = "{:.2f}".format(toInt)
    result = str(formated).replace(".", ",")

    return result


def toDateConverter(value):
    new_date = datetime.strptime(value, "%Y-%m-%d").strftime("%d/%m/%Y")

    return new_date


def result(payload):
    return render_template('boleto.html', data=payload)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8080)
