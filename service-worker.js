// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.
importScripts("service-worker-utils.js");
self.window = self; // This is necessary for the library to work in a service worker
importScripts("jsrsasign-all-min.js");

console.log(
  "This prints to the console of the service worker (background script)"
);

let USER_SIGNED_IN = false;
const CLIENT_ID = encodeURIComponent(
  "<YOUR_CLIENT_ID>"
);
const RESPONSE_TYPE = encodeURIComponent("id_token");
const REDIRECT_URI = encodeURIComponent(
  "https://ifonkoabimjngaeomelmfaifpaojiofb.chromiumapp.org"
);
const STATE = encodeURIComponent("jhsdfdshb");
const SCOPE = encodeURIComponent("openid");
const PROMPT = encodeURIComponent("consent");

let GOOGLE_ID = "";

function createAuthUrl() {
  let nonce = encodeURIComponent("123");
  let url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&state=${STATE}&scope=${SCOPE}&prompt=${PROMPT}&nonce=${nonce}`;

  return url;
}

function user_signed_in() {
  return USER_SIGNED_IN;
}

function getGoogleId() {
  return GOOGLE_ID;
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message === "login") {
    if (user_signed_in()) {
      sendResponse({
        message: "success",
        payload: {
          isSignedIn: true,
          google_id: getGoogleId(),
        },
      });
    } else {
      chrome.identity.launchWebAuthFlow(
        {
          url: createAuthUrl(),
          interactive: true,
        },
        function (redirect_url) {
          console.log(redirect_url);
          let id_token = redirect_url.substring(
            redirect_url.indexOf("id_token=") + 9
          );
          id_token = id_token.substring(0, id_token.indexOf("&"));
          const user_info = KJUR.jws.JWS.readSafeJSONString(
            b64utoutf8(id_token.split(".")[1])
          );
          if (user_info.aud === CLIENT_ID) {
            GOOGLE_ID = user_info.sub;
            USER_SIGNED_IN = true;

            sendResponse({
              message: "success",
              payload: { isSignedIn: true, user_info },
            });
            console.log("response chala Gaya ");
          } else {
            console.warn("Invalid client id");
          }
          return true;
        }

      );
      return true; // This keeps the message channel open until sendResponse is called
    }
  } else if (request.message === "logout") {
    USER_SIGNED_IN = false;
    return true;
  } else if (request.message === "is_user_signedin") {
    console.warn("sdfnvsjhfvbsxhbf");

    sendResponse({
      message: "success",
      payload: USER_SIGNED_IN,
      google_id: GOOGLE_ID,
    });
  }
});
// Importing and using functionality from external files is also possible.

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.
