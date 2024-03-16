// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.


// const getData = async () => {
//     console.log("fkknsdbfksbdfjksd")
//     const url = window.location.href;
//     const response = await fetch(`/overlay/contact-info/`);
//     const text = await response.text();
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(text, 'text/html');
//     const anchors = doc.querySelectorAll('a');
//     console.log(anchors)
//     const arr = Array.from(anchors, a => a.textContent);
//     console.log(arr);
// }
// getData();
// console.log("This prints to the console of the page (injected only if the page url matched)")

const emailRegEx = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
let emails = document.body.innerText.match(emailRegEx);
chrome.runtime.sendMessage({ emails: emails });


console.log