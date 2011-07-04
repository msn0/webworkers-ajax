(function(){
	
    if(typeof MJ === 'undefined'){
        MJ = {};
    }

    MJ.xhr = function(params) {

        var XMLHttpFactories = [
            function() {return new XMLHttpRequest();},
            function() {return new ActiveXObject("Msxml2.XMLHTTP");},
            function() {return new ActiveXObject("Msxml3.XMLHTTP");},
            function() {return new ActiveXObject("Microsoft.XMLHTTP");}
        ];

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
            postMessage(request.responseText);
        };
        if (request.readyState === 4) return;
        request.send(params.data);
    };

    onmessage = function(e){
        MJ.xhr(e.data);
    };

})();