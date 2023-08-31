npm init -y
index.js
db>connection.js

install Packages:
npm i mongoose express jsonwebtoken cors dotenv

.env 

update the package.json> scripts

npm i nodemon

>connection.js
>MOngodb is connected

>index,js
>app.listen> Port is started at server 

>gitignore

>model:
Schema:

>routes:
Router> exported and imported in index.js
app.use()

>SignUp Route:
Steps:
1-POST Method
2-Create an endpoint /users/signup
3-CB function
4-Validation using JOI
https://joi.dev/api/?v=17.9.1

5-creating schema variable and validating it.
6-Checking for duplicate email Id
7-hashing the password using bcrypt 
8-creating an new User
9-saving to the DB
10-FE=> using axios, send the request

>SignIn Route
Steps:
1-POST Method
2-Create an endpoint /users/signup
3-CB function
4-Validation using JOI
https://joi.dev/api/?v=17.9.1

5-creating schema variable and validating it.
6-Verifying the Email
7-Comaparing the password using bcrypt




