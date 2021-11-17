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
            let waitingUser = [...this.waitingList][0];
            this.waitingList.delete(waitingUser);
            this.users.add(waitingUser);
        }

        return true;
    }
}

var classMap = new Map();
classMap.set("yoga", new Class("yoga", Date.now() + 1200000, 100));
classMap.set("gym", new Class("gym", Date.now() + 300000, 200));
classMap.set("dance", new Class("dance", Date.now(), 300));

app.post("/book", (req, res) => {
    let type = req.query.type, name = req.query.name

    if(!(classMap.has(type))){
        res.status(400).json({
            msg: "This class type does not exist"
        })
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
    }

    let currentTime = Date.now();
    let classTime = classMap.get(type).startTime;
    
    let timeLeft = (parseInt(currentTime) - parseInt(classTime))/ 60000;

    if(timeLeft < 30){
        res.status(400).json({
            msg: "Sorry you can only cancel a class upto 30 min before the class starts"
        })
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