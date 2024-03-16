let firstTimeSignedIn = false;



function findEmailsInArray(array) {
  const emailRegEx = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
  let emails = [];

  array.forEach(string => {
    let matches = string.match(emailRegEx);
    if (matches) {
      emails = [...emails, ...matches];
    }
  });

  return emails;
}
let IS_LOGGED_IN = false;
let user = localStorage.getItem("user") || null;
const signIn = document.getElementById("sign-in");
console.log(user);
if ( user &&  user !== null) {
  user = JSON.parse(user);
  document.getElementById("username").textContent = user.name;
  console.log("askjbsdkjb");
  signIn.style.display = "none";
} else {
  signIn.style.display = "block";
}


const btn = document.getElementById("email");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let  { emails } = request;
  if (!emails ||  request.emails == null || request.emails.length == 0) {
    const h1 = document.createElement("h1");
    h1.textContent = "No emails found";
    document.body.appendChild(h1);
  } else {
    emails = findEmailsInArray(emails);
    const h1 = document.createElement("h1");
    h1.textContent = "Emails found";
    document.body.appendChild(h1);
    request.emails.forEach((email) => {
      const p = document.createElement("p");
      p.textContent = email;
      document.body.appendChild(p);
    });

    try {
      fetch("https://api.api-communet.tech/api/v1/mail/store-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("gid"),
        },
        body: JSON.stringify({ emails }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {}
  }
});

btn.addEventListener("click", async () => {
  console.log("Clicked")
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getData,
  });
});

function getData() {
  const emailRegEx = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
  let emails = document.body.innerText.match(emailRegEx) || [];
  const currentUrl = window.location.href.split("com")[1];
  
  fetch (currentUrl +  "overlay/contact-info")
    .then((response) => response.text())
    .then((data) => {
      const new_emails = data.match(emailRegEx) || [];
      emails = [...new_emails , ...emails];
      emails  = emails.filter((email, index) =>  email.includes("gmail.com")  || email.includes(".com") || email.includes(".in") || email.includes(".org") || email.includes(".net") || email.includes(".co.in") || email.includes(".co"));
      chrome.runtime.sendMessage({ emails: emails });
    });
}

document.querySelector("#sign-in").addEventListener("click", () => {
  console.log("Clicked ");
  chrome.runtime.sendMessage({ message: "login" }, async (response) => {
    console.log("Clicked Inside ")
    console.log(response)
    if (response.message === "success") {
      alert("User is already signed  getting google Id  in");
      // console.log("User is already signed in")
      await getGoogleId();
    }
  });
});

const getGoogleId = () => {
  chrome.runtime.sendMessage(
    { message: "is_user_signedin" },
    async (response) => {
      console.log(response);

      if (response.message === "success") {
        IS_LOGGED_IN = response.payload;
        localStorage.setItem("gid", response.google_id);
        await getProfile();
      }
    }
  );
};

// Function to get Profile

const getProfile = async () => {
  try {
    console.log("hgetesdjkbfuieasdbfjksda");
    const response = await fetch("https://api.api-communet.tech/api/v1/user/getuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("gid")}`,
      },
    });
    console.log(response);
    const data = await response.json();
    user = data.data;
    localStorage.setItem("user", JSON.stringify(user));
    document.getElementById("username").textContent = user.name;

    document.getElementById("username").textContent = user.name;
    console.log("askjbsdkjb");
    signIn.style.display = "none";
    console.log(data);
  } catch (error) {
    console.log(error.message);
  }
};
