使用方式：按住button，说对应指令，然后松开button

前端debug方式：
1）在recorder.js中， 将voiceControl的debug值设为true，即可在页面中显示百度和讯飞得到的返回值，以及对应的指令编码
2）在listen目录下运行‘python util/audio_debug.py’，生成的voice.wav即为原始音频

后端debug方式：listen目录下运行 ‘python sr.py Chinese’


11.30修改：
将token获取单独分离出来，放入util/get_token_baidu.py，它需要每天or每周定期运行，更新token
整理recorder.js和index.html 将用于debug的部分移除，并在endRecording中添加异步获取指令编码值的部分（TODO：根据编码进行操作 line85-91）

