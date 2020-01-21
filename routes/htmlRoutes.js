module.exports = function (app, path) {
  app.get("/", (req, res) => {
    res.sendFile("/views/index.html", { root: path.join(__dirname, "../public") })
  })
}