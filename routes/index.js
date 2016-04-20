exports.index = function(req, res) {
  res.render('default', {
    title: 'Home',
    classname: 'home',
    users: ['Ray', 'Morten', 'James']
  });
}
