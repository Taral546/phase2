var express = require('express');
var app = express();
var bodyParser=require('body-parser');
var fs=require('fs');

app.use(express.static('public'));

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var users = fs.existsSync('user_list.json');
var props = fs.existsSync('workspace_list.json');

var userObj = {"user":[]};
var propObj = {"workspace":[]};

if(users){
	console.log('Loading user_list.json file');
	var usersInfo=fs.readFileSync('user_list.json','utf-8');
	userObj=JSON.parse(usersInfo);
}
if(props){
	console.log('Loading workspace_list.json file');
	var propsInfo=fs.readFileSync('workspace_list.json','utf-8');
	propObj=JSON.parse(propsInfo);
}


app.get('/',(req,res)=>{
	res.sendFile(__dirname + "public/index.html");
});

app.get('/login',(req,res)=>{
	res.sendFile(__dirname + "public/login.html");
});

app.get('/signup',(req,res)=>{
    res.sendFile(__dirname + "public/signup.html");
});

app.get('/owner',(req,res)=>{
    res.sendFile(__dirname + "public/owner.html");
});

app.get('/addworkspace',(req,res)=>{
	res.sendFile(__dirname+ "public/add.html");
});

app.get('/coworker',(req,res)=>{
    res.sendFile(__dirname + "/index.html");
});


app.post('/add-user',urlencodedParser,(req,res,err)=>{	
	userObj.user.push({
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		password: req.body.password,
		role: req.body.role,
	});	
	
	res.redirect('/login');

    const data=JSON.stringify(userObj,null,2);
	fs.writeFileSync('user_list.json',data);	
	console.log("registered.");
	res.end();
});


app.post('/login',urlencodedParser,(req,res,err)=>{

	var email = req.body.email;
	var password = req.body.password;
	var size = userObj.user.length;
		
	for(var i=0;i<size;i++){

		var email_obj = pass = userObj.user[i].email;
		var pass_obj= pass = userObj.user[i].password;
		var role_obj = userObj.user[i].role;

		if(email == email_obj && password == pass_obj && role_obj=="owner")
		{
			res.redirect('/owner');
		}
		if(email == email_obj && password == pass_obj && role_obj=="coworker")
		{
            res.redirect('/workspaces');
		}
	}
});


app.post('/add-workspace', urlencodedParser, (req,res,err)=>{
	propObj.property.push({
		title:req.body.title,
		description:req.body.description,
		pw:req.body.pw
	});

	const data=JSON.stringify(propObj,null,2);
    fs.writeFile('prop_file.json',data,function(err){
        var props = propObj.property;
        console.log("added");
    });
	res.redirect('/workspaces');

});


app.get('/workspaces', (req,res)=>{
	var data=propObj.property;
	res.send(data);
});


const PORT = 8000;
app.listen(PORT,()=>{
	console.log(`App Listening at port: ${PORT}`);
});