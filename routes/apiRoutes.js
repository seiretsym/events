var db = require("../models");

module.exports = function (app) {
  // login
  app.put("/api/user/login", (req, res) => {
    db.User.findOne({
      where: req.body
    })
      .then(user => {
        res.json(user.id);
      }).catch(err => {
        console.log(err);
        res.send(false);
      })
  })
  // registration
  app.post("/api/user/register", (req, res) => {
    db.User.create(req.body)
      .then(user => {
        res.json(user.id);

      })
      .catch(err => {
        console.log(err)
        res.send(false);
      })
  })

  // user routes
  app.get("/api/user/:id", (req, res) => {
    db.User.findOne({
      where: {
        id: req.params.id
      }
    }).then(user => {
      res.json(user);
    }).catch(err => {
      console.log(err);
      res.send(false)
    })
  })

  app.put("/api/user/:id", (req, res) => {
    db.User.update(req.body, {
      where: {
        id: req.params.id
      }
    }).then(() => {
      res.send(true);
    }).catch(err => {
      console.log(err);
      res.send(false);
    })
  })

  app.get("/api/user/:id/events", (req, res) => {
    db.Event.findAll({
      where: {
        hostId: req.params.id
      }
    }).then(events => {
      res.json(events)
    }).catch(err => {
      console.log(err);
      res.send(false);
    })
  })

  app.get("/api/user/:id/attending", (req, res) => {
    db.UserEvent.findAll({
      where: {
        UserId: req.params.id
      },
      include: {
        model: db.Event,
        include: {
          model: db.User,
          as: "host",
          attributes: ["name"]
        }
      }
    }).then(users => {
      let data = [];
      users.forEach(user => {
        data.push(user.Event)
      })
      res.json(data);
    }).catch(err => {
      console.log(err);
      res.send(false);
    })
  })

  // event routes
  app.get("/api/event", (req, res) => {
    db.Event.findAll({
      include: [
        {
          model: db.User,
          as: "host",
          attributes: ["name"]
        }
      ],
    }).then(events => {
      res.json(events);
    }).catch(err => {
      console.log(err);
      res.send(false);
    })
  })
  app.post("/api/event", (req, res) => {
    db.Event.create(req.body)
      .then(eventData => {
        db.UserEvent.create({
          UserId: req.body.hostId,
          EventId: eventData.id
        }).then(() => {
          res.send(true);
        }).catch(err => {
          console.log(err);
          res.send(false);
        })

      }).catch(err => {
        console.log(err);
        res.send(false);
      })
  })
  app.get("/api/event/:id", (req, res) => {
    db.UserEvent.findAll({
      where: { eventId: req.params.id },
      include: [{
        model: db.Event,
        include: {
          model: db.User,
          as: "host",
          attributes: ["name"]
        }
      }, {
        model: db.User,
        attributes: ["name"]
      }]
    })
      .then(eventData => {
        res.json(eventData);
      }).catch(err => {
        console.log(err);
        res.send(false);
      })
  })
  app.put("/api/event/:id", (req, res) => {
    db.Event.update(req.body, { where: { id: req.params.id } })
      .then(() => {
        res.send(true);
      }).catch(err => {
        console.log(err);
        res.send(false);
      })
  })
  app.delete("/api/event/:id", (req, res) => {
    db.Event.destroy({ where: { id: req.params.id } })
      .then(() => {
        res.send(true)
      }).catch(err => {
        console.log(err);
        res.send(false);
      })
  })
  app.get("/api/event/:id/attendees", (req, res) => {
    db.UserEvent.findAll({
      where: {
        EventId: req.params.id
      },
      include: {
        model: db.User,
        attributes: ["name"]
      }
    }).then(attendees => {
      res.json(attendees)
    }).catch(err => {
      console.log(err);
      res.send(false);
    })
  })
  app.post("/api/attend", (req, res) => {
    db.UserEvent.findOne({
      where: req.body
    })
      .then(data => {
        if (data) {
          res.send(false)
        } else {
          db.UserEvent.create(req.body)
            .then(() => {
              res.send(true)
            }).catch(err => {
              console.log(err);
              res.send(false);
            })
        }
      }).catch(err => {
        console.log(err);
        res.send(false);
      })
  })

  app.delete("/api/attend", (req, res) => {
    db.UserEvent.destroy({
      where: req.body
    }).then(() => {
      res.send(true);
    }).catch(err => {
      console.log(err);
      res.send(false);
    })
  })
}