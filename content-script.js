const emailRegEx = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
let emails = document.body.innerText.match(emailRegEx);
chrome.runtime.sendMessage({ emails: emails });