const express = require('express'); //load express module
const parseCourseDataFile = require('./parseCourseDataFile'); //seperate js file for parsing course data file
const validateAndSanitize = require('./validateAndSanitize'); //seperate js file for validating and sanitizing inputs
const low = require('lowdb'); //use lowdb for database funcitonality
const FileSync = require('lowdb/adapters/FileSync'); //a component of lowdb for database functionality

const app = express();
const port = process.env.PORT || 3000; // 3000 will work for local development, but need process object for aws deployment

//lowdb database variables
const adapter = new FileSync('dbSchedule.json');
const db = low(adapter);

app.use(express.json()); //Middleware to enable parsing of json objects

// Middleware to do logging
app.use((req,res,next) => { //for all routes
    console.log(req.method + " request for " + req.url);
    next(); //keep going
})

app.use('/api/schedules', (req,res,next) =>{ //for routes including anything to do with schedules
    var test = db.get('schedules').value();

    if(!test){ //If the schedules component of the database does not exist, then create a default
        db.defaults({ schedules: [] }).write(); //Add default schedules array
    }
    
    next(); //keep going
});

app.use('/', express.static('../se3316-tsmit256-lab4-Angular/dist/se3316-tsmit256-lab4-Angular')); //used to serve front-end static files from static folder



//Back-end functionality 1a.
//Get all available subject codes (referred to as subject codes in lab3 handout)
app.get('/api/subjects', (req,res) => { 
    const subjectCodes = parseCourseDataFile.extractAllSubjects();
    res.send(subjectCodes);
});



//Back-end functionality 1b.
//Get all available classNames (referred to as descriptions in lab3 handout)
app.get('/api/classNames', (req,res) => {
    const classNames = parseCourseDataFile.extractAllClassNames();
    res.send(classNames);
});



//Back-end functionality 2.
//Get all course codes for a given subjectCode
app.get('/api/courses/:subjectCode', (req,res) => {
    const subjectCode_dirty = req.params.subjectCode;
    const subjectCode_clean = validateAndSanitize.cleanCode(res,subjectCode_dirty);
    //Extract object with the specific subjectCode
    const courses = parseCourseDataFile.extractCoursesBySubject(subjectCode_clean);

    if(!courses){ //subject will be false if not found by parsing function above.
        return res.status('404').send('The subject code was not found.');
    }
    res.send(courses);
});



//Back-end functionality 3a.
//Get course with specific subjectCode and courseCode
app.get('/api/courses/:subjectCode/:courseCode', (req,res) => {
    const courseCode_dirty = req.params.courseCode;
    const courseCode_clean = validateAndSanitize.cleanCode(res,courseCode_dirty);
    
    const subjectCode_dirty = req.params.subjectCode;
    const subjectCode_clean = validateAndSanitize.cleanCode(res,subjectCode_dirty);

    //Extract object with the specific subjectCode and courseCode
    const course = parseCourseDataFile.extractCoursesByCatalogNbr(subjectCode_clean, courseCode_clean);

    if(!course){
        return res.status('404').send('The combination of course code and subject code was not found.');
    }
    res.send(course);
});



//Back-end functionality 3b.
//Get course with specific subjectCode, courseCode, and component
app.get('/api/courses/:subjectCode/:courseCode/:component', (req,res) => {
    const component_dirty = req.params.component;
    const component_clean = validateAndSanitize.cleanCode(res,component_dirty);
    
    const courseCode_dirty = req.params.courseCode;
    const courseCode_clean = validateAndSanitize.cleanCode(res,courseCode_dirty);

    const subjectCode_dirty = req.params.subjectCode;
    const subjectCode_clean = validateAndSanitize.cleanCode(res,subjectCode_dirty);

    //Extract object with specific subjectCode, courseCode, and component
    const course = parseCourseDataFile.extractCoursesByComponent(subjectCode_clean, courseCode_clean, component_clean);

    if(!course){
        return res.status('404').send('The combination of course code, subject code, and component was not found.');
    }
    res.send(course);
});



app.route('/api/schedules')
  .get((req,res) => {
    const schedules = db.get('schedules').value();
    res.send(schedules);
})
//Back-end functionality 4
//Create a new schedule with a given schedule name
  .post((req, res) => {
    const name_dirty = req.body.name;
    const name_clean = validateAndSanitize.cleanScheduleName(res,name_dirty);

    const schedule = {
        name: name_clean,
        pairs: []
    };

    const existingScheds = db.get('schedules').value();

    //Check if the schedule name already exists
    for(var i in existingScheds){
        if(existingScheds[i].name == schedule.name){ //If a schedule with that name already exists in the database
            return res.status('400').send('A schedule with that name already exists.');
        }
    }

    db.get('schedules')
      .push(schedule)
      .write();

    res.send(schedule); //send back the object to the client
})

//Back-end functionality 9.
//Delete all schedules
  .delete((req,res) => {
    const schedules = db.get('schedules')
    .value();

    for(var i=schedules.length-1; i >= 0; i--){
        db.get('schedules').remove({name: schedules[i].name}).write();
    }    

    res.send(schedules);
});



//Back-end functionality 5.
//Save a list of subject code, course code pairs under a given schedule name.
app.route('/api/schedules/:scheduleName')
  .post((req,res) =>{
    const name_dirty = req.params.scheduleName;
    const name_clean = validateAndSanitize.cleanScheduleName(res,name_dirty);

    const schedule = db.get('schedules')
      .find({name: name_clean})
      .value();

    //If the schedule name does not exist send a 404 error
    if(!schedule){
        return res.status('404').send('A schedule with that name does not exist.');
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
        return res.status('404').send('The combination of course code and subject code is not a proper pair.');
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
        return res.status('404').send('A schedule with that name does not exist.');
    }

    //get the pairs for the specified scheduleName
    const pairs = db.get('schedules')
      .find({name: name_clean})
      .get('pairs')
      .value()

    res.send(pairs);
})

//Back-end functionality 7.
//Delete a schedule with a given name
  .delete((req,res) => {
    const name_dirty = req.params.scheduleName;
    const name_clean = validateAndSanitize.cleanScheduleName(res,name_dirty);

    const schedule = db.get('schedules')
      .find({name: name_clean})
      .value();

    //If the schedule name does not exist send a 404 error
    if(!schedule){
        return res.status('404').send('A schedule with that name does not exist.');
    }

    db.get('schedules')
    .remove({name: name_clean})
    .write();

    res.send(schedule);
});


//Back-end functionality 8.
//Get a list of schedule names and number of courses that are saved in each schedule
app.get('/api/scheduleCounts', (req,res) => {
    //Get the existing schedules
    const schedules = db.get('schedules')
    .value();

    const scheduleCourseCounts = []; //used to keep track of list of names and number of courses in each

    for(var sched in schedules){
        scheduleCourseCounts.push( { name: schedules[sched].name, courseCount: schedules[sched].pairs.length } );
    }

    res.send(scheduleCourseCounts);
});


app.listen(port, () => {
    console.log('Listening on port ' + port)
}); //start server


