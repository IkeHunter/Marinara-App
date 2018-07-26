
var todoItems = [];

module.exports = function(app, db, passport){

//	CRUD - Creat Read Update Destroy
//  crud is the basis of all applications
//  Update will not be included in this application

app.get('/', function(req,res){
	res.render('index');
});





// display signup
app.get('/signup', function(req,res){
	res.render('signup');
});


/****** TODO FUNCTION ********/
//Unregistered version
app.get('/todo', (req,res)=>{
	res.render('todo', {todoItems: todoItems});
});

app.post('/todo', (req,res)=>{

	todoItems.push(req.body);
	//res.render('todo', {todoItems: todoItems});
  res.json(todoItems);


});

app.delete('/todo/:item', function(req, res){
    todoItems = todoItems.filter(function(todo) {
      return todo.item.replace(/ /g, '-') !== req.params.item;
    });
    res.json(todoItems);
		// res.render('todo',{todoItems: todoItems});
  });

/******* TODO FUNCTION ^^ *******/

//info page after sign up
app.get('/info', (req,res)=>{
	res.render('info', {user: req.user});
})

/**** Home Page and Tasks ****/

app.get('/home', isLoggedIn, function(req, res){
	//read
	console.log('Read');
	let sql = 'select * from tasks where userID = '+req.user.id+';';
	let sql2 = 'select * from items where done = 1 && userID = '+req.user.id+';'
	db.query(sql, (err, results) => {
		if(err) throw err;
		db.query(sql2, (err, result) => {
			if(err) throw err;
			let lvl = result.length;
			let lvlNum = 0;
			if (lvl > 1 && lvl < 5){
				lvlNum = 1;
			}else if(lvl > 5 && lvl <8){
				lvlNum = 2;
			}else if(lvl >8){
				lvlNum = 3;
			}
			res.render('home', {tasks: results, user: req.user, level: lvlNum});
		});
	});

});

//new-task page
app.get('/task', (req,res)=>{
	res.render('task', {user: req.user});
});

app.delete('/delete-task/:id', (req,res)=>{
	let item = req.body;

	let sql = `delete from tasks where id = "${req.params.id}"`;
	let sql2 = `delete from items where task = "${req.params.id}"`;
	db.query(sql, item, (err, results)=>{
		if(err) throw err;

	})
	db.query(sql2, item, (err, results)=>{
		if(err) throw err;
		res.json(results);
	})
})

app.post('/task', (req,res)=>{
	let item = req.body;
	// let data = req.user.id;
	let nameVal = item.title;
	// let idVal = data.id;
	console.log(nameVal);
	// console.log(idVal);
	let sql = `insert into tasks (name, userID) values ("${nameVal}", "${req.user.id}")`;
	db.query(sql, item, (err, result)=>{
		if (err) throw err;
		//res.redirect('/home');
		res.redirect('/home');
	})
})

/***** ^ Home Page and tasks ^ *****/

/***** Items in tasks ******/

app.get('/item/:id', isLoggedIn, (req,res)=>{
	let sql = `select * from items where task = "${req.params.id}"`;
	db.query(sql, (err, results)=>{
		if(err) throw err;
		console.log(results)
		res.render('item', {items: results, task: req.params.id });
	})
})

app.post('/item/:id', (req,res)=>{

	let data = req.body;
	data['userID'] = req.user.id;
	task = parseInt(req.params.id);
	data['task'] = task;
	done = parseInt(0);
	data['done'] = done;
	console.log(data);
	let sql = 'insert into items set ? ;';
	db.query(sql, data, (err, results)=>{
		if(err) throw err;
		// res.render('item', {items: results});
		res.redirect('/item/'+ task);
	})
})

app.delete('/delete-item/:id', (req,res)=>{
	let item = req.body;
	let sql = `delete from items where id = "${req.params.id}"`;
	db.query(sql, item, (err, results)=>{
		if(err) throw err;
		res.json(results);
	})
})

app.get('/item-done/:id', (req,res)=>{
	let sql = `update items set done = 1 where id = "${req.params.id}" `
	db.query(sql, (err)=>{
		if(err) throw err;
		res.redirect('/item/'+task);
	})
})

/***** ^Items in tasks^ ******/

// handling sign up form
app.post('/signup', passport.authenticate('local-signup',  {
     successRedirect: '/info' ,
     failureRedirect: '/'}
    )
  );

// display signin
app.get('/signin',function(req,res) {
     res.render('signin', {message: req.flash('loginMessage')});
  });

// handling sign in form
app.post('/signin', passport.authenticate('local-signin',  {
     successRedirect: '/home',
     failureRedirect: '/'}
    )
  );

// destroying session
app.get('/logout',function(req,res){
	req.session.destroy(function(err) {
  res.redirect('/');
	});
});

};
function isLoggedIn(req, res, next) {
      if (req.isAuthenticated())
          return next();

      res.redirect('/signin');
  }
