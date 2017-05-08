var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    methodOverride = require("method-override");
    
mongoose.connect("mongodb://localhost/personalDestopApp");
    
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));


/* post it note*/


var toDoSchema = new mongoose.Schema({
    item: String,
    completed: Boolean,
    date: {type:Date, default:Date.now()},

});

var ToDo  = mongoose.model("ToDo", toDoSchema);


var postItSchema = new mongoose.Schema({
    text: String,
    date: {type:Date, default:Date.now()}
});

var PostIt  = mongoose.model("PostIt", postItSchema);


/* post it note*/

app.get("/postIt", function(req, res){
    PostIt.find({}, function(err, postItNote){
        if(err){
            console.log(err)
        } else{
            res.render("pieces/postIt", {postItNote: postItNote});
        }
    });
    
});
app.post("/postIt", function(req, res){
    PostIt.remove({}, function(err){
        if(err){
            console.log(err);
        }
    });
     var text = req.body.postIt.note;
    var newNote = {text: text};
    
    PostIt.create(newNote, function(err, newCreatedItem){
        if(err){
            console.log(err);
        } else {
             res.redirect("/desktop");
        }
    })
});

// PostIt.create({
//     text: "item"
// })


/*todo list*/
//to do list section



//list seeding
//  ToDo.remove({}, function(err){
//         if(err){
//             console.log(err);
//         }
//  });
 
// ToDo.create({
//     item: "work",
//     completed: false},
//     {item:"play",
//     completed: false},
//     {item:"life",
//     completed: true});




app.get("/toDo", function(req, res){
    ToDo.find({}, function(err, todoList){
        if(err){
            console.log(err)
        } else{
            res.render("pieces/toDoList", {todoList: todoList});
        }
            
    })
    
})
//create
app.post("/toDo", function(req, res){
    var item = req.body.item;
    var newItem = {item: item, completed:false};
    ToDo.create(newItem, function(err, newCreatedItem){
        if(err){
            console.log(err);
        } else {
             res.redirect("/desktop");
        }
    })
});
//update
app.put("/toDo/:id", function(req, res){
    ToDo.findByIdAndUpdate(req.params.id, req.body.todo ,function(err){
        if(err){
            console.log(err)
        } else {
            res.redirect("/desktop");
        }
    });
});
//destroy
app.delete("/toDo/:id", function(req, res){
    ToDo.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
        } else {
            res.redirect("/desktop");
            
        }
    });
});

//end toDo
/*todo list*/

//main landing
app.get("/", function(req, res){
   res.render("landing");
});
app.get("/desktop", function(req, res){
   ToDo.find({}, function(err, todoList){
        if(err){
            console.log(err)
        } else{
            PostIt.find({}, function(err, postItNote){
            if(err){
                console.log(err)
            } else{
                res.render("index", {postItNote: postItNote, todoList: todoList});
            }
        });
            //res.render("index", {todoList: todoList});
        }
    });
    
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Running!")
})