#!/usr/bin/python
import argparse
import requests
import json

# Exports contract ABI in JSON

ABI_ENDPOINT = 'https://api.etherscan.io/api?module=contract&action=getabi&address='

parser = argparse.ArgumentParser()
parser.add_argument('addr', type=str, help='Contract address')
parser.add_argument('-o', '--output', type=str, help="Path to the output JSON file", required=True)

def __main__():

    args = parser.parse_args()

    response = requests.get('%s%s'%(ABI_ENDPOINT, args.addr))
    response_json = response.json()
    abi_json = json.loads(response_json['result'])
    result = json.dumps({"abi":abi_json}, indent=4, sort_keys=True)

    open(args.output, 'w').write(result)

if __name__ == '__main__':
    __main__()
