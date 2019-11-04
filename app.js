var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();
//APP CONFIG
mongoose.connect("mongodb://localhost:27017/find_a_partner", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
// MONGOOSE MODEL CONFIG
var eventSchema = new mongoose.Schema({
    title: String,
    location: String,
    time: String,
    image: String,
    description: String,
    created: {type: Date, default: Date.now}
});

var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    image: String,
    email: String,
    mobile: String,
    major: String,
    bio: String,
});
// var postSchema = new mongoose.Schema({
//     title: String,
//     content:String
// });
var Event = mongoose.model("Event", eventSchema);
var User = mongoose.model("User", userSchema);


//RESTFUL ROUTES
//INDEX ROUTE
app.get("/", function(req, res){
    res.redirect("/events");
});
app.get("/events", function(req, res){
    Event.find({}, function(err, events){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index",{events: events});
        }
    });
});
app.get("/users", function(req, res){
    User.find({}, function(err, users){
        if(err){
            console.log("Error");
        } else {
            res.render("users", {users: users});
        }
    });
});
//NEW ROUTE
app.get("/events/new", function(req, res){
    res.render("new");
});
app.get("/users/new", function(req, res){
    res.render("newUsers");
});
//CREATE ROUTE
app.post("/events", function(req,res){
    // create event
    req.body.event.description = req.sanitize(req.body.event.description);
    Event.create(req.body.event, function(err, newEvent){
        if(err){
            res.render("new");
        } else{
            res.redirect("/events");
        }
    });
});
app.post("/users", function(req,res){
    // create user
    req.body.user.bio = req.sanitize(req.body.user.bio);
    User.create(req.body.user, function(err, newUser){
        if(err){
            res.render("newUser");
        } else{
            res.redirect("/users");
        }
    });
});
app.get("/events/:id", function(req, res){
    Event.findById(req.params.id, function(err, foundEvent){
        if(err){
            res.redirect("/events");
        } else{
            res.render("show", {event: foundEvent});
        }
    });
});
app.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            res.redirect("/users");
        } else{
            res.render("showUser", {user: foundUser});
        }
    });
});
app.get("/events/:id/edit", function(req, res){
    Event.findById(req.params.id, function(err, foundEvent){
        if(err){
            res.redirect("/events");
        } else{
            res.render("edit",{event: foundEvent});
        }
    });
});
//UPDATE
app.put("/events/:id", function(req, res){
    req.body.event.description = req.sanitize(req.body.event.description);
    Event.findByIdAndUpdate(req.params.id, req.body.event, function(err, updatedBlog){
        if(err){
            res.redirect("/events");
        } else{
            res.redirect("/events/"+req.params.id);
        }
    });
});
app.delete("/events/:id", function(req, res){
    Event.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/events");
        } else{
            res.redirect("/events");
        }
    });
});
app.delete("/users/:id", function(req, res){
    User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/users");
        } else{
            res.redirect("/users");
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is Running!");
})
