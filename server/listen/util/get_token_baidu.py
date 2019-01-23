import json
from urllib.request import urlopen
from urllib.request import Request
from urllib.error import URLError
from urllib.parse import urlencode

# flags
API_KEY = 'NgawfS7s6NzVeFreXyYHWU6H'
SECRET_KEY = 'uvdyW57F7gCa817kmut4MGo9LTaPHBZw'
FORMAT = 'wav'  # file format, only support: pcm/wav/amr
CUID = '123456jwefjoefjoej'
RATE = 16000  # sampling rate
ASR_URL = 'http://vop.baidu.com/server_api'
TOKEN_URL = 'http://openapi.baidu.com/oauth/2.0/token'

def fetch_token():
    # generate token request
    params = {'grant_type': 'client_credentials', 'client_id': API_KEY, 'client_secret': SECRET_KEY}
    post_data = urlencode(params)
    post_data = post_data.encode('utf-8')

    # request token
    req = Request(TOKEN_URL, post_data)

    # results, extract access_token
    try:
        f = urlopen(req)
        result_str = f.read()
    except URLError as err:
        # print('token http response http code : ' + str(err.code))
        raise DemoError("Cannot get token from baidu, response error" + str(err.code))
    result_str = result_str.decode()
    result = json.loads(result_str)
    if ('access_token' in result.keys() and 'scope' in result.keys()):
        # if not SCOPE in result['scope'].split(' '):
        #     raise DemoError('scope is not correct')
        # print('SUCCESS WITH TOKEN: %s ; EXPIRES IN SECONDS: %s' % (result['access_token'], result['expires_in']))
        return result['access_token']
    else:
        raise DemoError(
            'MAYBE API_KEY or SECRET_KEY not correct: access_token or scope not found in token response')

token=fetch_token()
with open('token.txt','w') as f:
    f.write(token)
# print(token)
