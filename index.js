var express = require('express');
var app = express();
 

require('./router/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile)
app.use(express.static(__dirname + '/public'));
 
app.set('port', (process.env.PORT || 5000));



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


