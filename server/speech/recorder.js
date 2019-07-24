var voiceControl={
    recorder:null,
    voice:null,
    language:"English",
    debug:false,
}

// *************************
//    Control functions
// *************************

// start recording
function startRecording() {
    if (voiceControl.recorder) {
        voiceControl.recorder.clear();
        voiceControl.recorder.start();
        return;
    }
    HZRecorder.get(function(rec) {
        voiceControl.recorder = rec;
        voiceControl.recorder.start();
    });
}

// End recording,sends the recording to backend server, gets the corresponding instruction.
function endRecording() {
    return new Promise(function(res){
    function toBackend(record) {
        // Encoding data to base64
        var reader = new FileReader();
        reader.readAsDataURL(record);
        return new Promise(function(resolve) {
            reader.onload = function() {
                // Get the DATAURL from encoding data, only save base64 content
                base64Data = reader.result.replace(/^data:audio\/\wav+;base64,/, "")
                $.ajax({
                        method: "POST",
                        url: API_SPEECH,
                        data: {
                            lang: voiceControl.language,
                            audio: base64Data,
                        },
                    })
                    .done(function(msg) {
                        console.log(msg)
                        data = JSON.parse(msg);
                        baidu = data['baidu'];
                        xunfei = data['xunfei'];
                        if (baidu['state'] == 0) {
                            baiduMessage = baidu['data'];
                            $(".messages").html("Op: "+baiduMessage);
                        } else {
                            baiduMessage = baidu['error']['err_msg'];
                            $(".messages").html("ERR: "+baiduMessage);
                        }
                        if (xunfei['state'] == 0) {
                            xunfeiMessage = xunfei['data'];
                        } else {
                            xunfeiMessage = xunfei['error']['err_msg'];
                        }
                        if (voiceControl.debug) {
                            console.log(baidu);
                            console.log(xunfei);
                            $(".messages").html(
                                "results: <br /> baidu:" + baiduMessage +
                                '<br /> xunfei:' + xunfeiMessage +
                                '<br /> caozuo:' + data['caozuo']
                            );
                        }
                        resolve(data['caozuo']);
                    })
                    .fail(function() {
                        $(".messages").html("server error");
                    })
            }
        })
    }
    if (voiceControl.recorder) {
        voiceControl.recorder.stop();
        voiceControl.voice = voiceControl.recorder.getBlob();
        voiceControl.recorder.clear();
    }
    $(".messages").html("loading~");
    if(voiceControl.voice){
        toBackend(voiceControl.voice.blob).then(function callback_for_vr(value) {
            console.log(value);
            // return operation code to front-end
            res(value);
            }
        );
    }
    });
}

// Change the language.
function getlanguage() {
    voiceControl.language = $('input[name="language"]:checked').val();
}

// *************************
//     recording part
// *************************
// Loading recording part
(function(window) {
    // For compatible
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    var HZRecorder = function(stream, config) {
        config = config || {};
        config.sampleBits = config.sampleBits || 16;
        config.sampleRate = config.sampleRate || 16000;


        // Set an audio context object.
        audioContext = window.AudioContext || window.webkitAudioContext;
        var context = new audioContext();

        // Put the input voice stream to the object.
        var audioInput = context.createMediaStreamSource(stream);

        // Set the volume.
        var volume = context.createGain();
        audioInput.connect(volume);

        context.onstatechange = function() {
            console.log("state", context.state);
        }
        // Set buffer to save voice
        var bufferSize = 4096;
        var recorder = context.createScriptProcessor(bufferSize, 2, 2);

        var audioData = {
            size: 0
                ,
            buffer: []
                ,
            inputSampleRate: context.sampleRate
                ,
            inputSampleBits: 16 //Could choose 8 or 16
                ,
            outputSampleRate: config.sampleRate
                ,
            oututSampleBits: config.sampleBits //Could choose 8 or 16
                ,
            input: function(data) {
                this.buffer.push(new Float32Array(data));
                this.size += data.length;
            },
            compress: function() { // Merge and compression
                // Merge
                var data = new Float32Array(this.size);
                var offset = 0;
                for (var i = 0; i < this.buffer.length; i++) {
                    data.set(this.buffer[i], offset);
                    offset += this.buffer[i].length;
                }
                // Compress
                var compression = parseInt(this.inputSampleRate / this.outputSampleRate);
                var length = data.length / compression;
                var result = new Float32Array(length);
                var index = 0,
                    j = 0;
                while (index < length) {
                    result[index] = data[j];
                    j += compression;
                    index++;
                }
                return result;
            },
            encodeWAV: function() {
                var sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
                var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
                var bytes = this.compress();
                var dataLength = bytes.length * (sampleBits / 8);
                var buffer = new ArrayBuffer(44 + dataLength);
                var data = new DataView(buffer);

                var channelCount = 1; // Only one channel.
                var offset = 0;

                var writeString = function(str) {
                    for (var i = 0; i < str.length; i++) {
                        data.setUint8(offset + i, str.charCodeAt(i));
                    }
                };

                // Resource exchange file identifier
                writeString('RIFF');
                offset += 4;
                // The total number of bytes from the beginning of the next address to the end of the file.
                data.setUint32(offset, 36 + dataLength, true);
                offset += 4;
                // WAV
                writeString('WAVE');
                offset += 4;
                // Waveform format
                writeString('fmt ');
                offset += 4;
                // Filter bytes, usually 0x10 = 16
                data.setUint32(offset, 16, true);
                offset += 4;
                // Format category (sampled data in PCM format)
                data.setUint16(offset, 1, true);
                offset += 2;
                // channel Count
                data.setUint16(offset, channelCount, true);
                offset += 2;
                // sample Rate
                data.setUint32(offset, sampleRate, true);
                offset += 4;
                // Waveform data transmission rate
                data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true);
                offset += 4;
                // Bytes for one sampling
                data.setUint16(offset, channelCount * (sampleBits / 8), true);
                offset += 2;
                // sample Bits
                data.setUint16(offset, sampleBits, true);
                offset += 2;
                // data
                writeString('data');
                offset += 4;
                // dataLength
                data.setUint32(offset, dataLength, true);
                offset += 4;
                // write data
                if (sampleBits === 8) {
                    for (var i = 0; i < bytes.length; i++, offset++) {
                        var s = Math.max(-1, Math.min(1, bytes[i]));
                        var val = s < 0 ? s * 0x8000 : s * 0x7FFF;
                        val = parseInt(255 / (65535 / (val + 32768)));
                        data.setInt8(offset, val, true);
                    }
                } else {
                    for (var i = 0; i < bytes.length; i++, offset += 2) {
                        var s = Math.max(-1, Math.min(1, bytes[i]));
                        data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                    }
                }

                return new Blob([data], {
                    type: 'audio/wav'
                });
            }
        };

        // start recording
        this.start = function() {
            audioInput.connect(recorder);
            recorder.connect(context.destination);
        };

        // stop recording
        this.stop = function() {
            recorder.disconnect();
            return audioData.buffer.length;
        };

        // Get blob object.
        this.getBlob = function() {
            var time = this.stop();
            return {
                duration: time,
                blob: audioData.encodeWAV(),
            };
        };

        this.clear = function() {
            audioData.buffer = [];
            audioData.size = 0;
        }

        // Play the recording
        this.play = function(audio, blob) {
            blob = blob || this.getBlob().blob;
            audio.src = window.URL.createObjectURL(blob);
        };


        recorder.onaudioprocess = function(e) {
            audioData.input(e.inputBuffer.getChannelData(0));
            //record(e.inputBuffer.getChannelData(0));
        };

    };
    // Throw the error
    HZRecorder.throwError = function(message) {
        // console.error(message);
        alert(message);
    };
    // Support recording or not
    HZRecorder.canRecording = !!navigator.getUserMedia;
    // Get the recorder
    HZRecorder.get = function(callback, config) {
        HZRecorder.throwError = config && config.error || HZRecorder.throwError;
        if (callback) {
            if (navigator.getUserMedia) {
                navigator.getUserMedia({
                        audio: true
                    }
                    ,
                    function(stream) {
                        var rec = new HZRecorder(stream, config);
                        callback(rec);
                    },
                    function(error) {
                        switch (error.code || error.name) {
                            case 'PERMISSION_DENIED':
                            case 'PermissionDeniedError':
                                HZRecorder.throwError('用户拒绝提供信息。');
                                break;
                            case 'NOT_SUPPORTED_ERROR':
                            case 'NotSupportedError':
                                HZRecorder.throwError('浏览器不支持录音功能。');
                                break;
                            case 'MANDATORY_UNSATISFIED_ERROR':
                            case 'MandatoryUnsatisfiedError':
                                HZRecorder.throwError('无法发现指定的硬件设备。');
                                break;
                            default:
                                HZRecorder.throwError('无法打开麦克风。异常信息:' + (error.code || error.name));
                                break;
                        }
                    });
            } else {
                HZRecorder.throwErr('浏览器不支持录音功能。');
                return;
            }
        }
    };
    window.HZRecorder = HZRecorder;
})(window);
