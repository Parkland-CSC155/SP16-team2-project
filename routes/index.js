exports.index = function(req, res) {
  res.send("hello World");
  res.render('default', {
    title: 'Home'
  });
}

exports.login = function(req, res){
    res.send("login page");
    
}