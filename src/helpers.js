function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

const storageToken = localStorage.getItem("auth._token.keycloak");
const cookieToken = getCookie("auth._token.keycloak");

function getSavedUserToken(tokenKey = "auth._token.keycloak") {
  return getCookie(tokenKey);
}

export { getSavedUserToken };
