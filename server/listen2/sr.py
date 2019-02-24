import sys
import json
import hashlib
import base64
import csv
import io
import time
import re
from get_token_baidu import get_baidu_token

from urllib.request import urlopen
from urllib.request import Request
from urllib.error import URLError
from urllib.parse import urlencode


class DemoError(Exception):
    # pass
    def __init__(self, ErrorInfo):
        super().__init__(self)  # init super class
        self.errorinfo = ErrorInfo


def baidu_voice(audio, language):
    FORMAT = 'wav'  # only support pcm/wav/amr
    if language == 'Chinese' or language == 'chinese':
        DEV_PID = 1536
    else:
        DEV_PID = 1737
    CUID = '123456jwefjoefjoej';
    RATE = 16000;  # sampling rate
    ASR_URL = 'http://vop.baidu.com/server_api'

    def convert(token, audio):
        length = len(base64.urlsafe_b64decode(audio))
        params = {'dev_pid': DEV_PID,
                  'format': FORMAT,
                  'rate': RATE,
                  'token': token,
                  'cuid': CUID,
                  'channel': 1,
                  'speech': audio,
                  'len': length,
                  }
        post_data = json.dumps(params, sort_keys=False)
        # print post_data
        req = Request(ASR_URL, post_data.encode('utf-8'))
        req.add_header('Content-Type', 'application/json')

        # Get the text from response
        try:
            f = urlopen(req)
            result_str = f.read()
        except URLError as err:
            print('asr http response http code : ' + str(err.code))
            raise DemoError("Cannot get asr from baidu, response error" + str(err.code))
        result_str = str(result_str, 'utf-8')
        result = json.loads(result_str)

        # print(result)
        if ('result' in result.keys()):
            return result['result'][0]
        else:
            raise DemoError(result)

    with open('static-data/token.txt', 'r') as f:
        token = f.read()
        f.close()
    # print(token)
    result = convert(token, audio)
    return result


def xunfei_voice(audio, language):
    url = 'http://api.xfyun.cn/v1/service/v1/iat'
    api_key = '905183e09e5f792c4cdf4e24cf8a8a4d'  # api key
    x_appid = '5be15d7d'  # appid
    if language == 'Chinese' or language == 'chinese':
        lang = "sms16k"
    else:
        lang = "sms-en16k"
    param = {"engine_type": lang, "aue": "raw"}  
    x_time = int(int(round(time.time() * 1000)) / 1000)

    # get checksum
    x_param = base64.b64encode(json.dumps(param).replace(' ', '').encode('utf-8'))
    x_checksum_content = api_key + str(x_time) + str(x_param, 'utf-8')
    x_checksum = hashlib.md5(x_checksum_content.encode('utf-8')).hexdigest()

    body = urlencode({'audio': audio})
    x_header = {'X-Appid': x_appid,
                'X-CurTime': x_time,
                'X-Param': x_param,
                'X-CheckSum': x_checksum}

    req = Request(url=url, data=body.encode('utf-8'), headers=x_header, method='POST')

    try:
        result = urlopen(req)
        result = result.read().decode('utf-8')
    except URLError as err:
        # print(err)
        raise DemoError("Cannot get asr from xunfei, response error" + str(err.code))

    result = json.loads(result)
    # print("nanana",result)
    if (result['desc'] == 'success'):
        return result['data']
    else:
        raise DemoError(result)


import codecs
import jieba.posseg as pseg


class SimCilin:

    def __init__(self):
        self.cilin_path = 'static-data/cilin.txt'
        self.sem_dict = self.load_semantic()

    # Loading the Cilin semantic dictionary
    def load_semantic(self):
        sem_dict = {}
        for line in codecs.open(self.cilin_path, encoding='utf-8'):
            line = line.strip().split(' ')
            sem_type = line[0]
            words = line[1:]
            for word in words:
                if word not in sem_dict:
                    sem_dict[word] = sem_type
                else:
                    sem_dict[word] += ';' + sem_type

        for word, sem_type in sem_dict.items():
            sem_dict[word] = sem_type.split(';')
        return sem_dict

    # Calculate the similarity between two sem
    def compute_sem(self, sem1, sem2):
        def search(sem_list1, sem_list2):
            for i in range(6):
                if sem_list1[i] != sem_list2[i]:
                    return i

        sem1 = [sem1[0], sem1[1], sem1[2:4], sem1[4], sem1[5:7], sem1[-1]]
        sem2 = [sem2[0], sem2[1], sem2[2:4], sem2[4], sem2[5:7], sem2[-1]]
        dif_index = search(sem1, sem2)
        if dif_index == 0:
            return 1 / 10
        elif dif_index == 1:
            return 1 / 8
        elif dif_index == 2:
            return 1 / 6
        elif dif_index == 3:
            return 1 / 4
        elif dif_index == 4:
            return 1 / 2
        else:
            if sem1[5] == '=':
                return 0
            else:
                return 0.5

    # Calculat the similarity between words, choose the max simiarity in different sems.
    def compute_word_sim(self, word1, word2):
        if (word1 == word2):
            return 1
        sems_word1 = self.sem_dict.get(word1, [])
        sems_word2 = self.sem_dict.get(word2, [])
        score_list = [self.compute_sem(sem_word1, sem_word2) for sem_word1 in sems_word1 for sem_word2 in sems_word2]
        if score_list:
            return max(score_list)
        else:
            return 0

    # Calculate the sentence similarity.
    def distance(self, text1, text2):
        # print(text1,text2)
        words1 = [word.word for word in pseg.cut(text1) if word.flag[0] not in ['u', 'x', 'w']]
        words2 = [word.word for word in pseg.cut(text2) if word.flag[0] not in ['u', 'x', 'w']]
        score_words1 = []
        score_words2 = []
        for word1 in words1:
            score = max(self.compute_word_sim(word1, word2) for word2 in words2)
            score_words1.append(score)
        for word2 in words2:
            score = max(self.compute_word_sim(word2, word1) for word1 in words1)
            score_words2.append(score)
        similarity = (sum(score_words1) / len(words1) + sum(score_words2) / len(words2)) / 2
        # print(words1,words2,similarity)
        return similarity


def convert_chinese_to_instruction(sentence, command):
    def find_max(command_score):
        maxm = 0
        id = '0'
        count = 0
        for i in command_score.keys():
            if command_score[i] > maxm:
                maxm = command_score[i]
                id = i
                count = 1
            elif command_score[i] == maxm:
                count += 1
        if maxm >= 0.2 and count < 2:
            return (maxm, id)
        else:
            return (1, '0')

    simer = SimCilin()
    command_score = {}
    for i in command:
        score = simer.distance(i[0], sentence)
        command_name = i[2]
        command_score[command_name] = score

    return find_max(command_score)


def convert_english_to_instruction(sentence, command):
    def lcs(s1, s2):
        l1 = len(s1)
        l2 = len(s2)
        if l1 <= 0 or l2 <= 0:
            return 0
        dp = [[0] * (l2 + 1) for j in range(l1 + 1)]
        for i in range(1, l1 + 1):
            for j in range(1, l2 + 1):
                if (s1[i - 1] == s2[j - 1]):
                    dp[i][j] = 1 + dp[i - 1][j - 1]
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        return dp[l1][l2]

    def find_max(command_score):
        maxm = 0
        id = '0'
        count = 0
        for i in command_score.keys():
            if command_score[i] > maxm:
                maxm = command_score[i]
                id = i
                count = 1
            elif command_score[i] == maxm:
                count += 1
        # print(maxm,count)
        if maxm >= 0.2 and count < 2:
            return (maxm, id)
        else:
            return (1, '0')

    command_score = {}
    for i in command:
        lcs_i = lcs(i[1], sentence)
        command_name = i[2]
        score = lcs_i / (len(i[1]) + len(sentence))
        # print(i,score,lcs_i)
        command_score[command_name] = score

    return find_max(command_score)


# set for Chinese
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
language = sys.argv[1]
f = open('static-data/x.base64', 'r')
audiostr = f.readlines()[0].strip()

csv_file = csv.reader(open('static-data/command.csv', encoding='utf-8'))
command = []
for i in csv_file:
    command.append(i)
#######################################################################
try:
    sentence = baidu_voice(audiostr, language)
    score = convert_chinese_to_instruction(sentence, command)
    if language == "Chinese" or language == 'chinese':
        score = convert_chinese_to_instruction(sentence, command)
    else:
        score = convert_english_to_instruction(sentence, command)
    baidu_result = {'state': 0, 'data': sentence, 'score': score}
except DemoError as err:
    if ('err_no' in err.errorinfo.keys() and err.errorinfo['err_no'] == 3302):
        # print("dada")
        get_baidu_token()
        try:
            sentence = baidu_voice(audiostr, language)
            score = convert_chinese_to_instruction(sentence, command)
            if language == "Chinese" or language == 'chinese':
                score = convert_chinese_to_instruction(sentence, command)
            else:
                score = convert_english_to_instruction(sentence, command)
            baidu_result = {'state': 0, 'data': sentence, 'score': score}
        except DemoError as err:
            baidu_result = {'state': 1, 'error': err.errorinfo}
    else:
        baidu_result = {'state': 1, 'error': err.errorinfo}
############################################################################3
# try:
#     sentence = xunfei_voice(audiostr, language)
#     sentence = re.sub("[！，。？]", "", sentence)  # 去除标点
#     if language=="Chinese" or language=='chinese':
#         score = convert_chinese_to_instruction(sentence, command)
#     else:
#         score = convert_english_to_instruction(sentence, command)
#     xunfei_result = {'state': 0, 'data': sentence, 'score': score}
# except DemoError as err:
#     xunfei_result = {'state': 1, 'error': err.errorinfo}
#############################################################################
print(json.dumps(baidu_result))
print(json.dumps({'state': 1, 'error': 'no xunfei'}))  # (xunfei_result))
if ('score' in baidu_result.keys()):
    print(baidu_result['score'][1])
else:
    print(0)

# save the audio
import base64
import datetime
import random

nowTime = datetime.datetime.now().strftime('%Y%m%d%H%M%S')  
randomNum = random.randint(10, 99)
file = "voice/" + nowTime + '_' + str(randomNum) + ".wav"

ori_data = base64.b64decode(audiostr)

fout = open(file, 'wb')
fout.write(ori_data)
fout.close()

##log the results
if ('score' in baidu_result.keys()):
    import logging
    logging.basicConfig(level=logging.INFO, filename='result.log', filemode='a', format='%(message)s')
    logging.info(file + "-" + baidu_result['data'] + "-" + baidu_result['score'][1])
