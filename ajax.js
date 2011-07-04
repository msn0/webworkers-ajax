if(typeof MJ === 'undefined'){
    MJ = {};
}

/**
 * Ajax
 * EXPERIMENTAL
 */
MJ.ajax = function(params){
    var worker = MJ.XHRWorker;
    
    if(params.hasOwnProperty('worker') && params.worker === true){
        /* EXPERIMENTAL */
        worker = MJ.getXHRWorker('ajax-worker.js');
    }
    else {
        worker = new MJ.nonThreadedXHR();
    }
    worker.postMessage({
        url: params.url,
        success: params.success,
        data: params.data
    });
    worker.onmessage = function(e){
        params.success(JSON.parse(e.data));
        worker.terminate();
    };
};

/**
 * Choose xhr strategy
 * WebWorker XHR or classical, non-threaded xhr.
 */
MJ.getXHRWorker = function(w){
    return typeof Worker === undefined ? new MJ.nonThreadedXHR() : new Worker(w);
};

/**
 * Classical xhr
 */
MJ.nonThreadedXHR = function(){
    var XMLHttpFactories = [
        function() {return new XMLHttpRequest();},
        function() {return new ActiveXObject("Msxml2.XMLHTTP");},
        function() {return new ActiveXObject("Msxml3.XMLHTTP");},
        function() {return new ActiveXObject("Microsoft.XMLHTTP");}
    ];
    var that = this;
    var createXHRObject = function() {
        var xmlhttp = false;
        for (var i=0;i<XMLHttpFactories.length;i++) {
            try {
                xmlhttp = XMLHttpFactories[i]();
            }
            catch (e) {
                continue;
            }
            break;
        }
        return xmlhttp;
    };
    
    /**
     * send xhr
     */
    var xhr = function(params){
        var request = createXHRObject();
        if(!request) return;
        var method = (params.data) ? "POST" : "GET";
        request.open(method,params.url,true);
        if(params.data) {
            request.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        }
        request.onreadystatechange = function () {
            if (request.readyState !== 4) return;
            if (request.status !== 200 && request.status !== 304) {
                return;
            }
            that.onmessage({
                data: request.responseText
            });
        };
        if (request.readyState === 4) return;
        request.send(params.data);
    };
    
    /**
     * postMessage implementation
     */
    this.postMessage = function(params){
        xhr(params);
    };
    
    /**
     * User defined handler
     */
    this.onmessage = function(){
        
    };
    
    /**
     * worker.terminate implementation
     */
    this.terminate = function(){
        
    };
     
};