How to use: Click the button (keep pressing), say the corresponding command, then release the button.





Updated in January:
1. Modify the Chinese scoring method and add the 'Cilin' dictionary to compare synonyms.
2. Modify the audio save mode. Save wav file in python
3. add log
4. modify the folder structure

Updated12.13:

1. add English voice control
2. add automatic update token for baidu api

Updated12.3:

1. Add an audio save mechanism that will save all base64 files. In php, the file name is generated with the current time + random number. In python, the file name is passed as a parameter and the file is read.
2. Using lcs for scoring judgment instructions, add scoring function

Updated11.30:

1. Separate the getting tokens' function and put them into util/get_token_baidu.py. It needs to run regularly every day or every week to update the token.
2. Organize the recorder.js and index.html to remove the part used for debugging, and add the part of the asynchronous acquisition instruction encoding value in endRecording 