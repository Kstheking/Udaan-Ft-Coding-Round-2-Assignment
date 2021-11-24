"use strict";

const express = require('express');

const app = express();  

app.use(express.json()); 
app.use(express.urlencoded({extended: false}));

class Class{
    type;
    users;
    waitingList;
    startTime;
    capacity;

    constructor(type, time, capacity){
        this.type = type;
        this.users = new Set();
        this.waitingList = new Set();
        this.startTime = time;
        this.capacity = capacity;
    }

    bookUser(name){
        if(this.users.has(name)){
            return {
                statusCode: 400, 
                msg: "You are already booked"
            } 
        }
        else if(this.waitingList.has(name)){
            return {
                statusCode: 400, 
                msg: "You are waitlisted already"
            } 
             
        }
        else if(this.users.size < this.capacity){
            this.users.add(name)
            return {
                statusCode: 200, 
                msg: "You have been booked"
            }
             
        }
        else{
            this.waitingList.add(name)
            return {
                statusCode: 200, 
                msg: "You have been waitlisted"
            }
            
        }
    }

    cancelUser(name){
        if(this.users.has(name)){
            this.users.delete(name);
        }
        else return false;

        if( (this.users.size < this.capacity) && (this.waitingList.size > 0) ){
            let [ waitingUser ] = this.waitingList; //getting the first element
            this.waitingList.delete(waitingUser);
            this.users.add(waitingUser);
        }

        return true;
    }
}

var classMap = new Map();

let timeAfter30 = new Date();
timeAfter30.setMinutes(timeAfter30.getMinutes() + 30);

classMap.set("yoga", new Class("yoga", new Date('2022-02-17'), 100)); // a random future date
classMap.set("gym", new Class("gym", timeAfter30, 200)); //just 30 mins from now 
classMap.set("dance", new Class("dance", new Date('1999-09-10'), 300)); // a day from the past

app.post("/book", (req, res) => {
    let type = req.query.type, name = req.query.name

    if(!(classMap.has(type))){
        res.status(400).json({
            msg: "This class type does not exist"
        })
        return;
    }

    if((new Date()) > classMap.get(type).startTime){
        res.status(400).json({
            msg: "Sorry the class has been already started"
        })
        return ;
    }

    let booking = classMap.get(type).bookUser(name);
    res.status(booking.statusCode).json({
        msg: booking.msg
    })
})

app.post("/cancel", (req, res) => {
    let type = req.query.type, name = req.query.name

    if(!(classMap.has(type))){
        res.status(400).json({
            msg: "This class type does not exist"
        })
        return ;
    }

    let timeAfter30 = new Date();
    timeAfter30.setMinutes(timeAfter30.getMinutes() + 30);
    if(timeAfter30 > classMap.get(type).startTime){
        res.status(400).json({
            msg: "Sorry you can only cancel a class upto 30 min before the class starts"
        })
        return ;
    }

    let cancellation =  classMap.get(type).cancelUser(name);

    if(cancellation){
        res.status(200).json({
            msg: "Successfully cancelled"
        })
    }
    else{
        res.status(400).json({
            msg: "User is not booked in this class"
        })
    }

    

})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})