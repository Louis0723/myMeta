import {Message} from "./vo/message";

chrome.runtime.onMessage.addListener(function (request, sender:chrome.runtime.MessageSender ,sendResponse) {

	if(request.type === 'onload' && sender.tab && sender.tab.id) {
		let tabID;
		let tab = sender.tab;
		tabID = tab.id;
		console.log(`TabID1:${tabID}`);

		let myCode = `
    function injectScriptJS(fileName) {
        var oHead = document.getElementsByTagName('HEAD').item(0);
        var oScript = document.createElement("script");
        oScript.type = "text/javascript";
        oScript.src = fileName;
        oHead.appendChild(oScript);
    };
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.innerText = 'window.rorechen = 12345;alert("I am Back3")';
    oHead.appendChild(oScript);
    //injectScriptJS('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js');
    a=100;
    a
	    `;
		// window.__proto__.rorechen = '1234';console.log(1234);
		//debugger;
		// document.getElementsByTagName('body')[0].style='background-color:rebeccapurple;'
		chrome.tabs.executeScript(tabID, {code: myCode}, function (result) {
			console.log('The Code Run OK And Back ' + result);
		});
	}

});

chrome.runtime.onConnect.addListener(function (externalPort:chrome.runtime.Port) {
	externalPort.onDisconnect.addListener(function () {
		var ignoreError = chrome.runtime.lastError;
		console.log("onDisconnect");
	});
	externalPort.onMessage.addListener((message, port:chrome.runtime.Port) => {
		console.log(`You Have Message ${message}`);
		externalPort.postMessage(`You Have Responses`);
	})
});


// 作者：focusOn
// 链接：https://www.jianshu.com/p/ff8c15e8d88e
// 		來源：简书
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。



