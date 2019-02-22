使用方式：按住button，说对应指令，然后松开button

前端debug方式：
在recorder.js中， 将voiceControl的debug值设为true，即可在页面中显示百度和讯飞得到的返回值，以及对应的指令编码

1月：
1、修改中文打分方式，添加词林比较近义词。
2、修改音频保存方式。改为在python中保存wav
3、添加log
4、修改文件夹结构



12.13：
1、添加英文判断
2、添加自动更新token

12.3修改：
1、添加音频保存机制，将保存所有的base64文件。php中用当前时间+随机数生成文件名，python中将文件名作为参数传入，读取文件。
2、改成lcs进行打分判断指令，添加打分函数

11.30修改：
1、将token获取单独分离出来，放入util/get_token_baidu.py，它需要每天or每周定期运行，更新token
2、整理recorder.js和index.html 将用于debug的部分移除，并在endRecording中添加异步获取指令编码值的部分（TODO：根据编码进行操作 line85-91）

