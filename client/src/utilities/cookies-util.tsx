
const setCookie = (name: string, value: string, dayToExpire: number) => {
  const date = new Date();
  date.setTime(date.getTime() + (dayToExpire * 24 * 60 * 60 * 1000));
  let expires = 'expires=' + date.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=\/`;
}

const getCookie = (name: string) => {
  const cookieDecoded = decodeURIComponent(document.cookie);
  const cookieArray = cookieDecoded.split('; ');
  let result = null;

  cookieArray.forEach(element => {
    if (element.indexOf(name) == 0)
      result = element.substring(name.length + 1);
  })

  return result;
}

const deleteCookie = (name: string) => {
  setCookie(name, '', 0);
}

export { setCookie, getCookie, deleteCookie }