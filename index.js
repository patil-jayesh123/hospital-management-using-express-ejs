const express=require('express')
const app=express()

app.get('/',(req,res)=>{
    res.render("home.ejs")
})

app.get('/login',(req,res)=>{
    res.render("login.ejs")
})

app.get('/saveform',(req,res)=>{
    res.render("dashbord.ejs")
})

app.get('/submit',(req,res)=>{
    res.render("login.ejs")
})

app.get('/home.ejs',(req,res)=>{
    res.render("home.ejs")
})

app.get('/registerpage.ejs',(req,res)=>{
    res.render("registerpage.ejs")
})

app.get('/patients.ejs',(req,res)=>{
    res.render("patients.ejs")
})

app.get('/doctors.ejs',(req,res)=>{
    res.render("doctors.ejs")
})

app.get('/appointments.ejs',(req,res)=>{
    res.render("appointments.ejs")
})

app.get('/pharmacy.ejs',(req,res)=>{
    res.render("pharmacy.ejs")
})

app.get('/profile.ejs',(req,res)=>{
    res.render("profile.ejs")
})


const PORT=3000
const HOST='127.0.0.1'

app.listen(PORT,HOST,()=>{
    console.log(`server is running on http://${HOST}:${PORT}`);
    
})