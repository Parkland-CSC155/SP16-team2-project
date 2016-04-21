## How do use an API Key for my API? 
An API Key is a way that most web-based APIs use to secure their endpoints. By inspecting each request to ensure it has a valid API key, we can be sure our app is safe. 

### How do I do that?
This is the most simple example: 
```
const APIKEY = 'abcd'; // some unique value that attackers cannot guess

// validate all requests to the /api -based routes
app.use(function(req, res, next){
   
   if(req.baseUrl !== "/api"){
       next();
       return;
   }
   
   // REQUEST: www.blah.com/api?apiKey=abcd
   var reqApiKey = req.query.apiKey
   
   if(!reqApiKey){
        res.status(401);
        res.send("Missing API Key");
        return;   
   } 
   
   if(reqApiKey !== APIKEY){
        res.status(401);
        res.send("Invalid API Key");
        return; 
   }
    
   // all good at this point, so let the request move on through the pipeline
   next();
});

```