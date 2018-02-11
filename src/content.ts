import {Message} from "./vo/message";

let message = new Message();
message.type = 'onload';
message.msg = 'Hello';
chrome.runtime.sendMessage(message, function (message) {
    if(message) {
        alert(`Type:${message.type} Msg:${message.msg}`);
    }
});
