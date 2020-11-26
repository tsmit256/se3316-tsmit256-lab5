const express = require('express'); //load express module
const parseCourseDataFile = require('./parseCourseDataFile'); //seperate js file for parsing course data file
const validateAndSanitize = require('./validateAndSanitize'); //seperate js file for validating and sanitizing inputs
const low = require('lowdb'); //use lowdb for database funcitonality
const FileSync = require('lowdb/adapters/FileSync'); //a component of lowdb for database functionality
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const bcrypt = require ('bcrypt');

const app = express();
const port = process.env.PORT || 3000; // 3000 will work for local development, but need process object for aws deployment
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "GJhssdhfgtJSFKDTDTTaAGHGYTgjgjsdfjrrjgHKSSDFSgjgKKLOjgjdFHQZgaapwgJAofoivaoqosogaRGKAROivfotGSd";
const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE || 60*60;
const GOOGLE_CLIENT_ID = '377942630150-bnac8vub3oso7hau5b8h3ap6004mh4kq.apps.googleusercontent.com';
const SALT_ROUNDS = 10

//lowdb database variables
const adapter = new FileSync('db.json');
const db = low(adapter);

app.use(express.json()); //Middleware to enable parsing of json objects


// Middleware to do logging
app.use((req,res,next) => { //for all routes
    console.log(req.method + " request for " + req.url);
    next(); //keep going
});


app.use(['/api/open/schedules', '/api/secure/schedules'], (req,res,next) =>{ //for routes including anything to do with schedules
    var test = db.get('schedules').value();

    if(!test){ //If the schedules component of the database does not exist, then create a default
        db.defaults({ schedules: [] }).write(); //Add default schedules array
    }
    
    next(); //keep going
});


//for routes including anything to do with policies
app.use(['/api/open/policies', '/api/admin/policies'], (req, res, next) => {
    var test = db.get('policies').value();

    if(!test){ //If the policies component of the database does not exist, then create a default
        db.defaults({ policies: [{name: "sp", descr: ""}, {name: "aup", descr: ""}, {name: "dmca", descr: ""}] }).write(); //Add default policies array
    }
    
    next(); //keep going
})


app.use('/api/open/users', (req,res,next) => { //for routes anything to do with users
    var test = db.get('users').value();
    var test2 = db.get('usersToConfirm').value();

    if(!test){ //If the users component of database doesn't exist, then create default
        db.defaults({ users: []}).write(); //Add default users array
    }

    if(!test2){ //If the usersToConfirm component doesn't exist, then create default
        db.defaults({ usersToConfirm: []}).write(); //Add default usersToConfirm array
    }

    next(); //keep going
});


app.use('/api/admin/logs', (req, res, next) => {//for routes anything to do with logs
    var test = db.get('logs').value();

    if(!test){ //If the logs component of database doesn't exist, then create default
        db.defaults({ logs: []}).write(); //add default logs array
    }
    next();
});


app.use('/', express.static('../se3316-tsmit256-lab4-Angular/dist/se3316-tsmit256-lab4-Angular')); //used to serve front-end static files from static folder


//Make sure there is a valid token for any request trying to access secured content
app.use(['/api/secure', '/api/admin'], (req, res, next) => {
    //Get the accessToken from headers
    let accessTokenHeader = req.headers.authorization;
    let accessToken;
    //accessTokenHeader should be in the form 'Bearer 1234567'
    var parts = accessTokenHeader.split(' ');

    //Make sure there is two parts and that 'Bearer' is in the header
    if(parts.length === 2 && /^Bearer$/i.test(parts[0])){
        accessToken = parts[1];
    }
    else{
        return res.status(403).send('The access token is not correctly formatted');
    }

    let payload;
    try{
        //verify the accessToken
        payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

        //if request is coming from admin then role must be admin
        if(req.originalUrl.includes('/api/admin') && payload.role != 'admin'){
            return res.status(401).send('You need to be administrator to access to this page');
        }
        //if request is secure then role can be either regular or admin
        else if(payload.role != 'regular' && payload.role != 'admin'){
            return res.status(401).send('You must be logged in to access this page');
        }
        
        req.user = payload;
    }
    catch(e){
        return res.status(401).send('Your session has expired');
    }
    
    next();
})


//for all routes related to reviews
app.use('/api/secure/reviews', (req,res,next) => {
    var test = db.get('reviews').value();

    if(!test){ //If the reviews component of the database doesn't exist, then create default
        db.defaults({ reviews: []}).write(); //Add default reviews array
    }

    next(); //keep going
})


//Back-end functionality 1a.
//Get all available subject codes (referred to as subject codes in lab3 handout)
app.get('/api/open/subjects', (req,res) => { 
    const subjectCodes = parseCourseDataFile.extractAllSubjects();
    res.send(subjectCodes);
});



//Back-end functionality 1b.
//Get all available classNames (referred to as descriptions in lab3 handout)
// app.get('/api/open/classNames', (req,res) => {
//     const classNames = parseCourseDataFile.extractAllClassNames();
//     res.send(classNames);
// });



//Back-end functionality 2.
//Get all course codes for a given subjectCode
app.get('/api/open/courses/:subjectCode', (req,res) => {
    const subjectCode_dirty = req.params.subjectCode;
    const subjectCode_clean = validateAndSanitize.cleanCode(res,subjectCode_dirty);
    //Extract object with the specific subjectCode
    var courses = parseCourseDataFile.extractCoursesBySubject(subjectCode_clean);

    if(!courses){ //subject will be false if not found by parsing function above.
        return res.status(404).send('The subject code was not found.');
    }

    //append reviews to courses
    courses = retrieveReviewsFromDb(courses);

    res.send(courses);
});



//Back-end functionality 3a.
//Get course with specific subjectCode and courseCode
app.get('/api/open/courses/:subjectCode/:courseCode', (req,res) => {
    const courseCode_dirty = req.params.courseCode;
    const courseCode_clean = validateAndSanitize.cleanCode(res,courseCode_dirty);
    
    const subjectCode_dirty = req.params.subjectCode;
    const subjectCode_clean = validateAndSanitize.cleanCode(res,subjectCode_dirty);

    //Extract object with the specific subjectCode and courseCode
    var course = parseCourseDataFile.extractCoursesByCatalogNbr(subjectCode_clean, courseCode_clean);

    if(!course){
        return res.status(404).send('The combination of course code and subject code was not found.');
    }

    //append reviews to course
    course = retrieveReviewsFromDb(course);

    res.send(course);
});



//Back-end functionality 3b.
//Get course with specific subjectCode, courseCode, and component
app.get('/api/open/courses/:subjectCode/:courseCode/:component', (req,res) => {
    const component_dirty = req.params.component;
    const component_clean = validateAndSanitize.cleanCode(res,component_dirty);
    
    const courseCode_dirty = req.params.courseCode;
    const courseCode_clean = validateAndSanitize.cleanCode(res,courseCode_dirty);

    const subjectCode_dirty = req.params.subjectCode;
    const subjectCode_clean = validateAndSanitize.cleanCode(res,subjectCode_dirty);

    //Extract object with specific subjectCode, courseCode, and component
    var course = parseCourseDataFile.extractCoursesByComponent(subjectCode_clean, courseCode_clean, component_clean);

    if(!course){
        return res.status(404).send('The combination of course code, subject code, and component was not found.');
    }

    //append reviews to course
    course = retrieveReviewsFromDb(course);

    res.send(course);
});



app.get('/api/open/keyword/courses/:keyword', (req,res) => {
    const keyword_dirty = req.params.keyword;
    const keyword_clean = validateAndSanitize.cleanKeyword(res, keyword_dirty);

    //Extract object with specific keyword in either 
    var courses = parseCourseDataFile.extractCoursesByKeyword(keyword_clean);

    if(!courses){ //courses will be false if not found by parsing function above.
        return res.status(404).send('This keyword has no similar courseCodes or classNames.');
    }

    //append reviews to courses
    courses = retrieveReviewsFromDb(courses);

    res.send(courses);
});

//The 'open' allows only access to public schedules
app.get('/api/open/schedules', (req, res) => {
    //get all schedules that are public
    const schedules = db.get('schedules').filter({public: true}).value();

    //Limit the info to only name, lastModified, creatorName, count
    limitedInfoSchedules = validateAndSanitize.limitToPublicSchedules(schedules);

    res.send(limitedInfoSchedules);
});




app.route('/api/secure/schedules')
   //The 'secure' allows access to user-specific schedules
  .get((req,res) => {
        const schedules = db.get('schedules').filter({creatorId: req.user.id}).value();
        
        //sort schedules by lastModified, starting with most recent schedule first
        schedules.sort( (a,b) => new Date(b.lastModified) - new Date(a.lastModified));
        
        res.send(schedules);
   })

    //Create a new schedule with a given schedule name
  .post((req, res) => {
    //Ensure that there is not already 20 named lists associated with this user
    usersSchedules = db.get('schedules').filter({creatorId: req.user.id}).value();
    if(usersSchedules.length >= 20){
        return res.status(404).send('You have already reached 20 lists. Please delete to add another.')
    }

    const name_dirty = req.body.name;
    const name_clean = validateAndSanitize.cleanScheduleName(res,name_dirty);
    const descr_dirty = req.body.description;
    const descr_clean = validateAndSanitize.cleanSchedDescription(res, descr_dirty);
    const public_dirty = req.body.public;
    const public_clean = validateAndSanitize.cleanBoolean(res, public_dirty)

    const existingScheds = db.get('schedules').value();

    const schedule = {
        name: name_clean,
        schedId: existingScheds.length,
        pairs: [],
        creatorName: req.user.name,
        creatorId: req.user.id,
        lastModified: Date.now(),
        public: public_clean,
        description: descr_clean
    };

    //Check if the schedule name already exists
    for(var i in existingScheds){
        if(existingScheds[i].name == schedule.name){ //If a schedule with that name already exists in the database
            return res.status(400).send('A schedule with that name already exists.');
        }
    }

    db.get('schedules')
      .push(schedule)
      .write();

    res.send(schedule); //send back the object to the client
})

//Used to update changes to a schedule
  .put((req,res) => {
    const schedId_dirty = req.body.schedId;
    const schedId_clean = validateAndSanitize.cleanId(res, schedId_dirty);
    const name_dirty = req.body.name;
    const name_clean = validateAndSanitize.cleanScheduleName(res,name_dirty);
    const descr_dirty = req.body.description;
    const descr_clean = validateAndSanitize.cleanSchedDescription(res, descr_dirty);
    const public_dirty = req.body.public;
    const public_clean = validateAndSanitize.cleanBoolean(res, public_dirty);
    const pairs_dirty = req.body.pairs;
    const pairs_clean = validateAndSanitize.cleanPairs(res, pairs_dirty);
    
    const oldSched = db.get('schedules').find({schedId: schedId_clean}).value();

    //Only allow user to access schedules that they made
    if(req.user.id != oldSched.creatorId){
        return res.status(401).send('This is a private schedule that you did not create');
    }

    const schedule = {
        name: name_clean,
        schedId: schedId_clean,
        pairs: pairs_clean,
        creatorName: req.user.name,
        creatorId: req.user.id,
        lastModified: Date.now(),
        public: public_clean,
        description: descr_clean
    };

    const existingScheds = db.get('schedules').value();

    //Ensure that new name does not already exist
    for(var i in existingScheds){
        if(existingScheds[i].name == schedule.name && existingScheds[i].schedId != schedule.schedId){ //If a schedule with that name already exists in the database
            return res.status(400).send('Another schedule with that new name already exists.');
        }
    }

    //Delete the old schedule
    db.get('schedules').remove({schedId: schedId_clean}).write();

    //Add the new schedule
    db.get('schedules')
      .push(schedule)
      .write();

    res.send(schedule); //send back the object to the client
});



//Back-end functionality 5.
//Save a list of subject code, course code pairs under a given schedule name.
app.route('/api/secure/schedules/:scheduleName')
  .post((req,res) =>{
    const name_dirty = req.params.scheduleName;
    const name_clean = validateAndSanitize.cleanScheduleName(res,name_dirty);

    var schedule = db.get('schedules')
      .find({name: name_clean})
      .value();

    //If the schedule name does not exist send a 404 error
    if(!schedule){
        return res.status(404).send('A schedule with that name does not exist.');
    }

    //Get the subject and course code pair
    const subjectCode_dirty = req.body.subjectCode;
    const courseCode_dirty = req.body.catalog_nbr;

    const subjectCode_clean = validateAndSanitize.cleanCode(res,subjectCode_dirty);
    const courseCode_clean = validateAndSanitize.cleanCode(res,courseCode_dirty);

    //Ensure this subjectCode and courseCode is a proper pair
    //Extract object with the specific subjectCode and courseCode
    const course = parseCourseDataFile.extractCoursesByCatalogNbr(subjectCode_clean, courseCode_clean);

    if(!course){
        return res.status(404).send('The combination of course code and subject code is not a proper pair.');
    }

    //Create a new pair with the clean subjectcode and courseCode
    const pair = {
        subjectCode: subjectCode_clean,
        catalog_nbr: courseCode_clean
    }

    //Get the existing pairs in the schedule
    const existingPairs = db.get('schedules')
      .find({name: name_clean})
      .get('pairs')
      .value();

    //See if the new pair matches any existing pair
    for(var i in existingPairs){
        if(existingPairs[i].subjectCode == pair.subjectCode && existingPairs[i].catalog_nbr == pair.catalog_nbr){ //Replace existing pair with the new pair (values will be same but database will update)
            db.get('schedules')
            .find({name: name_clean})
            .get('pairs')
            .find(existingPairs[i]) //find the existing pair that matches the new pair and replace it with the new pair values
            .set('subjectCode', pair.subjectCode)
            .set('catalog_nbr', pair.catalog_nbr)
            .write();

            return res.send(schedule); //return schedule
        }
    }

    //If the pair is not an existing pair then add new pair
    db.get('schedules')
      .find({name: name_clean}) //find the specific schedule
      .get('pairs')
      .push(pair) //add the new pair to the pairs
      .write();

    schedule = db.get('schedules').find({name: name_clean}).value();

    res.send(schedule);    
})

//Back-end functionality 6.
//Get a list of subject code, course code pairs for a given schedule
  .get((req,res) => {
    const name_dirty = req.params.scheduleName;
    const name_clean = validateAndSanitize.cleanScheduleName(res,name_dirty);

    const schedule = db.get('schedules')
      .find({name: name_clean})
      .value();

    //If the schedule name does not exist send a 404 error
    if(!schedule){
        return res.status(404).send('A schedule with that name does not exist.');
    }

    //Only allow user to access schedules that they made
    if(req.user.id != schedule.creatorId){
        return res.status(401).send('This is a private schedule that you did not create');
    }

    //get the pairs for the specified scheduleName
    const pairs = db.get('schedules')
      .find({name: name_clean})
      .get('pairs')
      .value()

    res.send(pairs);
})

//Delete a schedule with a given name
.delete((req,res) => {
    const name_dirty = req.params.scheduleName;
    const name_clean = validateAndSanitize.cleanScheduleName(res,name_dirty);

    const schedule = db.get('schedules')
      .find({name: name_clean})
      .filter({creatorId: req.user.id}) //only search schedules that this user created
      .value();

    //If the schedule name does not exist send a 404 error
    if(!schedule){
        return res.status(404).send('A schedule that you made does not exist with that name.');
    }

    db.get('schedules')
    .remove({name: name_clean})
    .write();

    res.send(schedule);
});

//Get a list of subject code, course code pairs for a public schedule
app.route('/api/open/schedules/:scheduleName')
  .get((req,res) => {
    const name_dirty = req.params.scheduleName;
    const name_clean = validateAndSanitize.cleanScheduleName(res,name_dirty);

    const schedule = db.get('schedules')
      .find({name: name_clean})
      .value();

    //If the schedule name does not exist send a 404 error
    if(!schedule){
        return res.status(404).send('A schedule with that name does not exist.');
    }

    //Need to ensure that this is a public schedule 
    if(!schedule.public){
        return res.status(403).send('This schedule is private');
    }

    //get the pairs for the specified scheduleName
    const pairs = db.get('schedules')
      .find({name: name_clean})
      .get('pairs')
      .value()

    res.send(pairs);
});



//User Authentication
app.post('/api/open/users/authenticate', (req,res) => {
    const email_dirty = req.body.email;
    const password_dirty = req.body.password;

    const email_clean = validateAndSanitize.cleanEmail(res, email_dirty);
    const password_clean = validateAndSanitize.cleanPassword(res, password_dirty);

    const user = db.get('users')
    .find({email: email_clean});

    //Get the existing password
    const existingPassword = user
      .get('password')
      .value();

    if(!existingPassword){
        return res.status(404).send('A user account with that email does not exist');
    }

    if(!comparePasswords(password_clean, existingPassword)){
        return res.status(400).send('Password and email combination not correct');
    }

    const deactivatedStatus = user.get('deactivated').value();

    if(deactivatedStatus){
        //Return message if deactivated
        return res.status(403).send('Your account is marked as deactivated. Please contact site administrator.');
    }

    var jwtBearerToken = issueJwtToken(user.value());

    var role = user.get('role').value()

    // set it in the HTTP Response body
    res.status(200).json({
        token: jwtBearerToken,
        role: role
    });    

});


//User authentication using google api
app.post('/api/open/users/googleAuthenticate', (req, res) => {
    const token = req.body.token;
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    var payload;
    
    async function verify(resolve, reject) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
        if(payload){
            console.log("YOOO");
            resolve(payload);
        }
        else{
            console.log("UH OH");
            reject("invalid token");
        }
    }
    
    //Ensure that this google token is valid before issuing a new JWT token
    const verifyToken = new Promise(function(resolve, reject){
        verify(resolve, reject)
    }).then(data => {
        var email = db.get('users').find({id: payload['sub']}).get('email').value();
        var deactivatedStatus, jwtBearerToken, role;
        console.log("A");
        //Test if there is an email associated with this user
        if(!email){
            //The user does not yet exist so create new information
            user = {
                name: payload['name'],
                email: payload['email'],
                deactivated: false,
                role: "regular",
                id: payload['sub']
            };

            //add the user to the users database component
            db.get('users')
            .push(user)
            .write();

            deactivatedStatus = user.deactivated;
            if(deactivatedStatus){
                //Return message if deactivated
                return res.status(403).send('Your account is marked as deactivated. Please contact site administrator.');
            }
            console.log("B");
            jwtBearerToken = issueJwtToken(user);
            role = user.role;
            console.log("C");

        }
        else{
            deactivatedStatus = db.get('users').find({id: payload['sub']}).get('deactivated').value();
            console.log("D");
            if(deactivatedStatus){
                //Return message if deactivated
                return res.status(403).send('Your account is marked as deactivated. Please contact site administrator.');
            }
            console.log("E");
            jwtBearerToken = issueJwtToken(db.get('users').find({id: payload['sub']}).value());
            role = db.get('users').find({id: payload['sub']}).value().role;
            console.log("F");
        }
        console.log("G");
        // send token and role back
        res.status(200).send({token: jwtBearerToken, role: role}); 
    }).catch(err => {
        res.status(500).send('Google verification process has failed')
    });
});


// Creating a new account
app.post('/api/open/users/newAccount', (req, res) => {
    const name_dirty = req.body.name;
    const email_dirty = req.body.email;
    const password_dirty = req.body.password;

    const name_clean = validateAndSanitize.cleanName(res, name_dirty);
    const email_clean = validateAndSanitize.cleanEmail(res, email_dirty);
    const password_clean = validateAndSanitize.cleanPassword(res, password_dirty);

    //see if an account with that email already exsits
    const existingUsers = db.get('users')
    .value();

    for(var i in existingUsers){
        if(existingUsers[i].email == email_clean)
            return res.status(400).send('An account with that email already exists');
    }

    verificationLink = hashPassword(email_clean); //hashing based on user information and remove slashes to avoid url conflicts
    verificationLink = verificationLink.replace('/', '');

    const newUser = {
        name: name_clean,
        email: email_clean,
        password: hashPassword(password_clean),
        deactivated: false,
        role: "regular",
        link: verificationLink
    };

    //The usersToConfirm database component stores information about users that are yet to be authorized
    db.get('usersToConfirm')
    .push(newUser)
    .write();

    res.send(newUser);
});


//This is used to verify the creation of a new account
app.post('/api/open/users/verification', (req, res) => {
    const link = req.body.link;

    var newUser = db.get('usersToConfirm')
    .find({link: link})
    .value();
    
    if(!newUser)
        return res.status(404).send('There is no new user account related to this link');

    //remove the user from the usersToConfirm database component
    db.get('usersToConfirm')
    .remove({link: link})
    .write();

    delete newUser.link; //we no longer need to attach a link to the user

    currentLength = db.get('users').value().length;
    newUser.id = currentLength; //asign an id to the user

    //transfer the user to the users database component
    db.get('users')
    .push(newUser)
    .write();

    res.send(newUser);
});



app.route('/api/secure/reviews/:subjectCode/:courseCode')
  //Post a new review about a particular pair
  .post((req, res) => {
    const courseCode_dirty = req.params.courseCode;
    const courseCode_clean = validateAndSanitize.cleanCode(res,courseCode_dirty);
    
    const subjectCode_dirty = req.params.subjectCode;
    const subjectCode_clean = validateAndSanitize.cleanCode(res,subjectCode_dirty);

    const message_dirty = req.body.message;
    const message_clean = validateAndSanitize.cleanReviewDescription(res, message_dirty);

    const review = {
        message: message_clean,
        lastModified: Date.now(),
        creatorName: req.user.name,
        pair: {
            subjectCode: subjectCode_clean,
            catalog_nbr: courseCode_clean
        },
        hidden: false,
        id: db.get('reviews').value().length
    }

    db.get('reviews')
    .push(review)
    .write(); 
    
    res.send(review);
  });


//Get all reviews
app.get('/api/admin/reviews', (req,res) =>{
    const reviews = db.get('reviews').value();
    res.send(reviews);
});


//Change the hidden boolean of review
app.post('/api/admin/reviews-hidden', (req,res) => {
    const reviewId_dirty = req.body.reviewId;
    const reviewId_clean = validateAndSanitize.cleanId(res, reviewId_dirty);

    //get the current hidden status
    var currentStatus = db.get('reviews').find({id: reviewId_clean}).value().hidden;
    var futureStatus = !currentStatus;

    //change the hidden status
    db.get('reviews').find({id: reviewId_clean})
        .assign({hidden: futureStatus}).write();

    res.send({hidden: futureStatus});
});


//upgrade a user's role to admin
app.post('/api/admin/grantPrivilege', (req, res) => {
    const email_dirty = req.body.email;
    const email_clean = validateAndSanitize.cleanEmail(res, email_dirty);

    const user = db.get('users').find({email: email_clean}).value();

    if(!user){
        return res.status(404).send("There is no user with this email.")
    }

    //assign the new role privilege
    db.get('users').find({email: email_clean})
        .assign({role: "admin"}).write();

    res.send({role: "admin"});    
});



//Change a user's deactivation boolean
app.post('/api/admin/activation', (req, res) => {
    const email_dirty = req.body.email;
    const email_clean = validateAndSanitize.cleanEmail(res, email_dirty);

    const user = db.get('users').find({email: email_clean}).value();

    if(!user){
        return res.status(404).send("There is no user with this email.")
    }

    //get the current deactivated status
    var currentStatus = db.get('users').find({email: email_clean}).value().deactivated;
    var futureStatus = !currentStatus;

    //assign the new role privilege
    db.get('users').find({email: email_clean})
        .assign({deactivated: futureStatus}).write();

    res.send({deactivated: futureStatus});    
});


//Getting Policies
app.route('/api/open/policies/:policyName')
    .get((req,res) => {
    const policyName = req.params.policyName;
    if(policyName != "sp" && policyName != "dmca" && policyName != "aup"){
        return res.status(404).send("This is not a valid policyName");
    }

    const policy = db.get('policies').find({name: policyName}).value();

    res.send(policy);
});


//Updating Policies
app.post('/api/admin/policies/:policyName', (req,res) => {
    console.log("HEY1111");
    const policyName = req.params.policyName;
    if(policyName != "sp" && policyName != "dmca" && policyName != "aup"){
        return res.status(404).send("This is not a valid policyName");
    }
    
    const newDescr_dirty = req.body.descr;
    const newDescr_clean = validateAndSanitize.cleanPolicyDescr(res, newDescr_dirty);
    
    db.get('policies').find({name: policyName}).assign({descr: newDescr_clean}).write();
    
    res.send({descr: newDescr_clean});
});

app.route('/api/admin/logs')
  .post((req, res) => {
    const typeReq = validateAndSanitize.cleanTypeReq(res, req.body.typeReq);
    const date = validateAndSanitize.cleanDate(res, req.body.date);
    const reviewId = validateAndSanitize.cleanId(res, req.body.id);
    const descr = validateAndSanitize.cleanReviewDescription(res, req.body.descr);

    db.get('logs').push({typeReq: typeReq, date: date, reviewId: reviewId, descr: descr}).write();

    res.send({typeReq: typeReq, date: date, reviewId: reviewId, descr: descr});
})
  .get((req, res) => {
    const logs = db.get('logs').value();
    res.send(logs);
});


app.listen(port, () => {
    console.log('Listening on port ' + port)
}); //start server



//The remaining part of this document is helper functions

 function issueJwtToken(user){
    const userId = user.id;
    const name = user.name;
    const role = user.role;

    let payload = {name: name, role: role, id: userId};

    const jwtBearerToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_LIFE
    });

    return jwtBearerToken;
 }

 function hashPassword(password){
    return bcrypt.hashSync(password, SALT_ROUNDS);
 }

 function comparePasswords(password2, hash){
     return bcrypt.compareSync(password2, hash);
 }

 function retrieveReviewsFromDb(courses){
    //get reviews
    var allReviews = db.get('reviews').value();
    
    //iterate through each course in courses
    for(var c in courses){
        var relevantReviews = [];

        //specify how to filter the database of reviews
        let filterCriteria = {
            subjectCode: courses[c].subject,
            catalog_nbr: courses[c].catalog_nbr
        }

        //only grab reviews related to course
        for(var r in allReviews){
            if(allReviews[r].pair.catalog_nbr == filterCriteria.catalog_nbr && allReviews[r].pair.subjectCode == filterCriteria.subjectCode){
                relevantReviews.push(allReviews[r]);
            }
        }
        
        //append reviews to course
        courses[c].reviews = relevantReviews;
    }
    return courses;
 }