const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json()); //by default req.body is not enabled so we enabled it here

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
    
];



//req = request jo hme frontend se backend par ati hain
//res = response jo hm backend se frontend par bhjte haim

//get express me get karne ke lie use hota he

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// app.get('/api/courses', (req, res) => {
//     res.send([1, 2, 3]);
// });

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// app.get('/api/courses/:id', (req, res) => {
//     res.send(req.params.id);
// });

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given id was not found.');


    res.send(course);
});

// app.get('/api/posts/:year/:month', (req, res) => {
//     res.send(req.params);
// });

app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.query);
});


//post express me post karne ke lie use hota he
app.post('/api/courses', (req, res) => {
    
    //input validation manual

    // if(!req.body.name || req.body.name.length < 3){
    //     //400 bad request
    //     res.status(400).send('Name is required or should be minimum 3 character');
    //     return; //we dont want rest of the fuction execute if there is an error
    // }

    //input validation by joi

    //First we create Schema (Rule)
    // const schema = {name: Joi.string().min(3).required()};
    // const result = Joi.validate(req.body, schema);
    // console.log(result);
    // if(result.error){
    //     // res.status(400).send(result.error);
    //     res.status(400).send(result.error.details[0].message);
    //     return; //we dont want rest of the fuction execute if there is an error
    // }

    //object destructuring: here we use requider property of object
    const {error} = validateCourse(req.body); 

    // if(error){
    //     // res.status(400).send(result.error);
    //     res.status(400).send(error.details[0].message);
    //     return; //we dont want rest of the fuction execute if there is an error
    // }

    if(error) return res.status(400).send(error.details[0].message);


    const course = {id: courses.length + 1, name: req.body.name}; //by default req.body is not enabled so we enable it by app.use(express.json());
    courses.push(course);
    res.send(course);
});

//put express me value put karne ke lie use hota he
app.put('/api/courses/:id', (req, res) => {
    //Look up the course
    //If not exixting, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given id was not found.');
    
    //Validate
    //If Invalid, return 400 - Bad request
    // const schema = {name: Joi.string().min(3).required()};
    // const result = Joi.validate(req.body, schema);

    //we create validate function to getridof validation code
    // const result = validatCourse(course); 
    // if(result.error){
    //     // res.status(400).send(result.error);
    //     res.status(400).send(result.error.details[0].message);
    //     return; //we dont want rest of the fuction execute if there is an error
    // }

    //object destructuring: here we use requider property of object
    const {error} = validateCourse(req.body); 

    // if(error){
    //     // res.status(400).send(result.error);
    //     res.status(400).send(error.details[0].message);
    //     return; //we dont want rest of the fuction execute if there is an error
    // }

    if(error) return res.status(400).send(error.details[0].message);

    //Update course
    course.name = req.body.name;

    //Return the updated course
    res.send(course);
});


//delete express me value delete karne ke lie use hota he
app.delete('/api/courses/:id', (req, res) => {
    //Look up the Course
    //Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given id was not found.');

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //Return the same course
    res.send(course);

});


function validateCourse(course){
    const schema = {name: Joi.string().min(3).required()};
    return Joi.validate(course, schema);
}


//for "process.env.PORT" auto port selection in deployment on server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));