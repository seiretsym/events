
let userId = localStorage.getItem("user")

let isObjEmpty = obj => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

let renderEventsPage = () => {
  // side nav
  renderSideNav();
  // contents
  renderContent()
}

let renderContent = content => {
  switch (content) {
    case "myevents":
      getEventsByUserId(userId).then(events => {
        renderMyEvents(events);
      })
      break;
    case "create":
      renderCreatePage();
      break;
    case "attending":
      getEventsAttending(userId).then(events => {
        renderEventsAttending(events);
      })
      break;
    default:
      getEventInfo().then(events => {
        renderEvents(events);
      })
  }
}

let renderEvents = events => {
  let content = $(".contents")
  content.empty().append($("<h4>").text("Events List"), $("<hr>"))
  events.forEach(event => {
    let cardbody = $("<div>").addClass("card-body")
    let title = $("<h5>").addClass("mb-0").text(event.title)
    let host = $("<div>").addClass("d-flex text-muted").text(`Hosted by ${event.host.name}`)
    let description = $("<p>").addClass("card-text").text(event.description)
    let btn = $("<button>").addClass("btn btn-dark attend").data("id", event.id).text("Attend")
    getAttendees(event.id).then(attendees => {
      let guests = $("<div>").addClass("ttip ml-auto").text("Guests: " + attendees.length)
      let tooltip = $("<span>").addClass("ttiptext")
      let guestlist = $("<ul>").addClass("list-group")
      attendees.forEach(attendee => {
        let li = $("<li>").addClass("list-group-item text-dark").text(attendee.User.name)
        guestlist.append(li)
      })
      tooltip.append(guestlist)
      guests.append(tooltip)
      host.append(guests);
      cardbody.append(title, host, $("<hr>"), description, btn)
      let card = $("<div>").addClass("card mb-3").append(cardbody)
      content.append(card)
    })
  })
}

let renderEventsAttending = events => {
  let content = $(".contents")
  content.empty().append($("<h4>").text("Events I'm Attending"), $("<hr>"))
  events.forEach(event => {
    let cardbody = $("<div>").addClass("card-body")
    let title = $("<h5>").addClass("mb-0").text(event.title)
    let host = $("<div>").addClass("d-flex text-muted").text(`Hosted by ${event.host.name}`)
    let description = $("<p>").addClass("card-text").text(event.description)
    let btn = $("<button>").addClass("btn btn-dark unattend").data("id", event.id).text("Unattend")
    getAttendees(event.id).then(attendees => {
      let guests = $("<div>").addClass("ttip ml-auto").text("Guests: " + attendees.length)
      let tooltip = $("<span>").addClass("ttiptext")
      let guestlist = $("<ul>").addClass("list-group")
      attendees.forEach(attendee => {
        let li = $("<li>").addClass("list-group-item text-dark").text(attendee.User.name)
        guestlist.append(li)
      })
      tooltip.append(guestlist)
      guests.append(tooltip)
      host.append(guests);
      cardbody.append(title, host, $("<hr>"), description, btn)
      let card = $("<div>").addClass("card mb-3").append(cardbody)
      content.append(card)
    })
  })
}

let renderMyEvents = events => {
  let content = $(".contents")
  content.empty().append($("<h4>").text("Events I'm Hosting"), $("<hr>"))
  events.forEach(event => {
    let card = $("<div>").addClass("card p-3 mb-3")
    let title = $("<input>").addClass("form-control").attr({
      id: `event${event.id}-title`,
      value: event.title,
      placeholder: "Event Title",
      autocomplete: "title"
    })
    let titleDiv = $("<div>").addClass("form-group").append($("<label>").text("Event Title"), title);
    let description = $("<textarea>").addClass("form-control").attr({
      id: `event${event.id}-description`,
      placeholder: "Event Description",
      rows: 3,
      autocomplete: "description"
    }).val(event.description)
    let descriptionDiv = $("<div>").addClass("form-group").append($("<label>").text("Event Description"), description)

    let btn = $("<button>").addClass("mr-3 btn btn-dark update-event").data("id", event.id).text("Update")
    let btn2 = $("<button>").addClass("btn btn-dark delete").data("id", event.id).text("Delete")
    let form = $("<form>").append(titleDiv, descriptionDiv, btn, btn2)
    card.append(form)
    content.append(card)
  })
}

let renderCreatePage = () => {
  let content = $(".contents")
  let title = $("<input>").addClass("form-control").attr({
    id: "event-title",
    placeholder: "Event Title",
    autocomplete: "title"
  })
  let titleDiv = $("<div>").addClass("form-group").append(title);
  let description = $("<textarea>").addClass("form-control").attr({
    id: "event-description",
    placeholder: "Event Description",
    rows: 5,
    autocomplete: "description"
  })
  let descriptionDiv = $("<div>").addClass("form-group").append(description)
  let btn = $("<button>").addClass("form-control btn btn-dark create-event").text("Create Event")
  let form = $("<form>").append(titleDiv, descriptionDiv, btn)
  content.empty().append($("<h4>").text("Create an Event"), $("<hr>"), form)
}

let renderSideNav = () => {
  let sideNav = $(".sidenav");
  let btn1 = $("<button>").addClass("nav-link btn events").text("View Events")
  let btn2 = $("<button>").addClass("nav-link btn myevents").text("My Events")
  let btn3 = $("<button>").addClass("nav-link btn attending").text("Attending")
  let btn4 = $("<button>").addClass("nav-link btn create").text("Create Event")
  let li1 = $("<li>").addClass("nav-item").append(btn1)
  let li2 = $("<li>").addClass("nav-item").append(btn2)
  let li3 = $("<li>").addClass("nav-item").append(btn3)
  let li4 = $("<li>").addClass("nav-item").append(btn4)
  let ul = $("<ul>").addClass("nav flex-column").append(li1, li2, li3, li4)
  sideNav.empty().append(ul)
}

let renderProfilePage = () => {
  let contents = $(".contents");
  getUserInfo(userId).then(user => {
    let h4 = $("<h4>").text("Edit Profile");
    let inputEmail = $("<input>").addClass("form-control").attr({
      type: "email",
      value: user.email,
      readonly: true,
      autocomplete: "why the fuck do i need this?"
    });
    let div1 = $("<div>").addClass("form-group").append(inputEmail);
    let inputPassword = $("<input>").addClass("form-control").attr({
      type: "password",
      id: "password",
      value: "",
      placeholder: "change password",
      autocomplete: "new-password"
    });
    let div2 = $("<div>").addClass("form-group").append(inputPassword);
    let inputPwConfirm = $("<input>").addClass("form-control").attr({
      type: "password",
      id: "pwconfirm",
      value: "",
      placeholder: "confirm password",
      autocomplete: "new-password"
    });
    let div3 = $("<div>").addClass("form-group").append(inputPwConfirm);
    let inputName = $("<input>").addClass("form-control").attr({
      type: "name",
      id: "name",
      value: user.name,
      placeholder: "enter your name",
      autocomplete: "name"
    });
    let div4 = $("<div>").addClass("form-group").append(inputName);
    let button = $("<button>").addClass("form-control btn btn-dark update-user").text("Update");
    let form = $("<form>").append(div1, div2, div3, div4, button);
    contents.empty();
    contents.append(h4, form);

  })
}

let getEventInfo = () => {
  return $.ajax({
    url: "/api/event",
    type: "GET"
  })
}

let getEventsByUserId = id => {
  return $.ajax({
    url: "/api/user/" + id + "/events",
    type: "GET"
  })
}

let getEventsAttending = id => {
  return $.ajax({
    url: "/api/user/" + id + "/attending",
    type: "GET"
  })
}

let createEvent = data => {
  return $.ajax({
    url: "/api/event",
    type: "POST",
    data: data
  })
}

let attendEvent = data => {
  return $.ajax({
    url: "/api/attend/",
    type: "POST",
    data: data
  })
}

let unattendEvent = data => {
  return $.ajax({
    url: "/api/attend/",
    type: "DELETE",
    data: data
  })
}

let updateEvent = (id, data) => {
  return $.ajax({
    url: "/api/event/" + id,
    type: "PUT",
    data: data
  })
}

let deleteEvent = id => {
  return $.ajax({
    url: "/api/event/" + id,
    type: "DELETE"
  })
}

let getUserInfo = userId => {
  return $.ajax({
    url: "/api/user/" + userId,
    type: "GET",
  })
}

let saveUserInfo = data => {
  return $.ajax({
    url: "/api/user/" + userId,
    type: "PUT",
    data: data
  })
}

let getAttendees = eventId => {
  return $.ajax({
    url: "/api/event/" + eventId + "/attendees",
    type: "GET"
  })
}

$(".logout").on("click", event => {
  event.preventDefault();
  window.localStorage.removeItem("user");
  window.location.reload();
})

$(".profile").on("click", event => {
  event.preventDefault();
  renderProfilePage();
})

$(document).on("click", ".create", event => {
  event.preventDefault();
  renderContent("create")
})

$(document).on("ready", renderEventsPage())

$(document).on("click", ".events", event => {
  event.preventDefault();
  renderContent();
})

$(document).on("click", ".myevents", event => {
  event.preventDefault();
  renderContent("myevents");
})

$(document).on("click", ".attending", event => {
  event.preventDefault();
  renderContent("attending");
})

$(document).on("click", ".create-event", event => {
  event.preventDefault()
  let eventTitle = $("#event-title").val().trim();
  let eventDescription = $("#event-description").val().trim();
  if (eventTitle.length < 1) {
    $("#event-title").focus();
  } else if (eventDescription.length < 1) {
    $("#event-description").focus();
  } else {
    let data = {
      title: eventTitle,
      description: eventDescription,
      hostId: userId
    }
    createEvent(data).then(() => {
      renderContent("myevents")
    })
  }
})

$(document).on("click", ".update-user", event => {
  event.preventDefault();
  let password = $("#password").val().trim();
  let pwconfirm = $("#pwconfirm").val().trim();
  let name = $("#name").val().trim();
  let data = {}
  if (name.length > 1) {
    data = {
      ...data,
      name: name,
    }
  }
  if (password.length > 1) {
    if (password !== pwconfirm) {
      $("#pwconfirm").val("").attr("placeholder", "password doesn't match").focus();
    } else {
      data = { ...data, password: password }
    }
  }
  if (!isObjEmpty(data)) {
    saveUserInfo(data).then(() => {
      window.location.reload();
    })
  }
})

$(document).on("click", "button.attend", event => {
  event.preventDefault();
  let btn = event.target;
  let eventId = $(btn).data("id");
  let data = {
    UserId: userId,
    EventId: eventId
  }
  attendEvent(data).then(attend => {
    if (attend) {
      renderContent("attending")
    } else {
      alert("You're already attending this event!")
    }
  })
})

$(document).on("click", "button.delete", event => {
  event.preventDefault();
  let btn = event.target;
  let eventId = $(btn).data("id");
  deleteEvent(eventId).then(() => {
    renderContent("myevents")
  })
})

$(document).on("click", "button.unattend", event => {
  event.preventDefault();
  let btn = event.target;
  let eventId = $(btn).data("id");
  let data = {
    UserId: userId,
    EventId: eventId,
  }
  unattendEvent(data).then(() => {
    renderContent("attending")
  })
})

$(document).on("click", "button.update-event", event => {
  event.preventDefault();
  let btn = event.target;
  let eventId = $(btn).data("id");
  let data = {
    title: $(`#event${eventId}-title`).val().trim(),
    description: $(`#event${eventId}-description`).val().trim(),
  }
  updateEvent(eventId, data).then(() => {
    renderContent();
  })
})