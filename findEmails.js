export function findEmailsInArray(array) {
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