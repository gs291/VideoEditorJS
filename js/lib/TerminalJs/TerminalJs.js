/**
 * Created by Guillaume on 03/02/2015.
 */

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

Terminal = function(){
    this.prefix = "js/lib/TerminalJs/bin";
    this.alias = {"ffmpeg" : this.prefix+"/ffmpeg.js", "list" : this.prefix+"/list.js", "gnuplot":this.prefix+"/gnuplot.js"};
    this.lastCommands = [];
    this.Workers = [];
    this.Files = [];
};
Terminal.prototype.exist = function(bin){
    var found = false;
    for(var key in this.alias)
    {
        console.log("-"+key);
        if (key===bin)
        {
            found = true;
            break;
        }
    }
    return found;
};
Terminal.prototype.processCmd = function(cmd, callback){
    that = this;
    console.log("DOGS: " + cmd, cmd.split(" ")[0]);
    if (this.exist(cmd.split(" ")[0]))
    {
        var workerId = this.GenerateWorkerId();
        this.Workers.push({ worker : new Worker(this.alias[cmd.split(" ")[0]]), id :workerId});
        this.lastCommands.push(cmd)
        this.startWorker(workerId, cmd.replace(cmd.split(" ")[0],'').trim(), callback);
    }
    else
    {
        console.log("Command not found");;
    }
};
Terminal.prototype.onWorkerMessage = function(e, index){
    console.log(e, "index" + index);
    var message = e.data;
    if (message.type == "stdout")
    {
        console.log(message.text);
    }
    else if(message.type == "stop")
    {
        console.log("Executed in "+message.time+"ms");
        this.Workers[index].worker.terminate();
       // this.Workers.remove(index);
        if (message.hasOwnProperty("data"))
        {
            window.URL = window.URL || window.webkitURL;
            url = window.URL.createObjectURL(message.data);
            console.log("URL IS "+url);
        }
    }
};
Terminal.prototype.GenerateWorkerId = function(){
    if (this.Workers.length == 0)
    {
        return 0;
    }
    else
    {
        return this.Workers[this.Workers.length-1].id + 1;
    }
};
Terminal.prototype.startWorker = function(id, argv, callback){
    var foundIndex = -1;
    for (i=0; i<this.Workers.length;i++)
    {
        if (this.Workers[i].id == id)
        {
            console.log(i, this.Workers[i]);
            foundIndex = i;
        }
    }

    that = this;

    if (foundIndex != -1) {

        this.Workers[foundIndex].worker.onmessage = function (e) {
            if(callback && typeof callback == "function") {
                callback(e, foundIndex);
            }
            else
            {
                that.onWorkerMessage(e, foundIndex)
            }
        };
        this.Workers[foundIndex].worker.postMessage({
            "id": that.Workers[foundIndex].id,
            "status": that.alias,
            "command": "start",
            "files" : that.Files,
            "argv" : argv
        });
    }
    else
    {
        console.log("cant't start ...")
    }
};
Terminal.prototype.loadFile = function(url, name, callback){
    that = this;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function (oEvent) {
            var arrayBuffer = oReq.response; // Note: not oReq.responseText
            if (arrayBuffer) {
                var byteArray = new Uint8Array(arrayBuffer);
                that.Files.push({data : byteArray, name: name})
                console.log("File"+name+" loaded !");
                if(callback && typeof callback == "function") {
                    oReq.onload = callback(oEvent);
                }
            }
            else
            {
                console.log("Unable to load file as ArrayBuffer");
            }

    };

    oReq.send(null);

};
