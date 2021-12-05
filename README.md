# Udaan-Ft-Coding-Round2

## [Problem Statement](https://github.com/Kstheking/Udaan-Ft-Coding-Round-2-Assignment/files/7655807/Fitness_Slot_Booking_System.1.4.1.1.pdf)

## Setup Instructions 

- Download this folder somewhere in your system 
- Open a terminal and change path to this folder 
- Make sure node and npm is installed by checking version `node -v` and `npm --v` 
- Install packages with `npm install` 
- Run the backend server `node index.js`
- Now you can make the api calls on the below written routes and the url `localhost:3000` using Postman or anything else


## API GUIDE 

- `/book?name=somename&type=yoga` is a POST route for booking a slot in a class with a user name and a type of class  , it takes two query parameters `name` and `type` and returns an appropriate result 
- `/cancel?name=somename&type=yoga` is a POST route for cancelling a slot in a class with a user name and a type  , it takes two query parameters `name` and `type` and returns an appropriate result 

## Notes 

- The classes and their respective timing have been intialized to some arbitrary values they can be changed and checked as needed
