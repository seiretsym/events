// signin event listener
$(document).on("click", ".signin", event => {
  event.preventDefault();
  renderAuthForms("signin")
})

$(document).on("click", ".register", event => {
  event.preventDefault();
  renderAuthForms("register")
})

let renderAuthForms = type => {
  let div1 = $("<div>").addClass("form-group");
  let div2 = $("<div>").addClass("form-group");
  let btn = $("<btn>").addClass("form-control btn btn-dark");
  let inputEmail = $("<input>").addClass("form-control").attr({
    id: "email",
    type: "email",
    placeholder: "enter email address",
    autocomplete: "email"
  });

  let inputPW = $("<input>").addClass("form-control").attr({
    id: "password",
    type: "password",
    placeholder: "enter password",
    autocomplete: "password"
  });

  let form = $("#auth");
  form.empty();

  div1.append(inputEmail);
  div2.append(inputPW);

  switch (type) {
    case "signin":
      btn.addClass("loginAuth").text("Login");
      form.append(div1, div2, btn);
      break;
    default:
      let div3 = $("<div>").addClass("form-group");
      let inputPWConf = $("<input>").addClass("form-control").attr({
        id: "pwconfirm",
        type: "password",
        placeholder: "confirm password",
        autocomplete: "password-confirm"
      });
      let inputName = $("<input>").addClass("form-control").attr({
        id: "name",
        type: "name",
        placeholder: "your name",
        autocomplete: "name"
      })
      let div4 = $("<div>").addClass("form-group").append(inputName)
      btn.addClass("registerAuth").text("Register");
      div3.append(inputPWConf);
      form.append(div1, div2, div3, div4, btn);
  }
}

$(document).on("click", ".registerAuth", event => {
  event.preventDefault();
  let email = $("#email");
  let pw = $("#password");
  let pwconf = $("#pwconfirm");
  let name = $("#name");
  if (email.val().trim().length < 1) {
    email.focus();
  } else if (pw.val().trim().length < 1) {
    pw.focus();
  } else if (pw.val().trim() !== pwconf.val().trim()) {
    pwconf.val("").attr("placeholder", "passwords don't match").focus();
  } else if (name.val().trim().length < 1) {
    name.focus();
  } else {
    let user = {
      email: email.val().trim(),
      password: pw.val().trim(),
      name: name.val().trim()
    }
    $.ajax({
      url: "/api/user/register",
      type: "POST",
      data: user
    }).then(conf => {
      if (conf) {
        // do something after registration
        window.localStorage.setItem("user", conf)
        $("#auth").empty();
        window.location.reload();
      } else {
        // registration failed
        console.log("registration failed")
      }
    })
  }
})

$(document).on("click", ".loginAuth", event => {
  event.preventDefault();
  let email = $("#email");
  let pw = $("#password");
  if (email.val().trim().length < 1) {
    email.focus();
  } else if (pw.val().trim().length < 1) {
    pw.focus();
  } else {
    let user = {
      email: $("#email").val(),
      password: $("#password").val(),
    }
    $.ajax({
      url: "/api/user/login",
      type: "PUT",
      data: user,
    }).then(conf => {
      if (conf) {
        // do something after login
        console.log("logged in")
        window.localStorage.setItem("user", conf)
        $("#auth").empty();
        window.location.reload();
      } else {
        // do something because login failed
        console.log("login failed")
        $("#password").val("").focus();
      }
    })
  }
})