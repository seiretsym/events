if (window.localStorage.getItem("user")) {
  $("#content").load("/views/authed.html")
} else {
  $("#content").load("/views/login.html")
}