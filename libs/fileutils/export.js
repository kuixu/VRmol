/**
 * Created by Kui Xu on 2017/8/7.
 * mail: xukui.cs@gmail.com
 */
importScripts('debugout.js');
self.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'start':
      self.postMessage('WORKER STARTED: ' + data.msg);
      //exportToObj:function() {
        var outfile = new debugout();
        outfile.logFilename = data.filename;
        outfile.log(data.data);
        //outfile.log("By xukui from ZhangLab in Tsinghua Univ.");
        outfile.downloadLog();

        //PDB.tool.writeTextFile(f, result);
    //}
      self.postMessage('WORKER ENDED: ' + data.msg);
      break;
    case 'stop':
      self.postMessage('WORKER STOPPED: ' + data.msg +
                       '. (buttons will no longer work)');
      self.close(); // Terminates the worker.
      break;
    default:
      self.postMessage('Unknown command: ' + data.msg);
  };
}, false);
