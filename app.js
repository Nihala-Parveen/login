const express = require ('express')
const session = require ('express-session')
const bodyParser = require ('body-parser')
const app = express () 

//view engine
app.set ('view engine','ejs')

//serve static files
app.use ( express.static ( __dirname + '/views') )

app.use (express.urlencoded ( { extended : true}))

//session
app.use ( session ( {
    secret : "login" ,
    resave : false ,
    saveUninitialized : true
}))

const checkAuth = ( req , res , next) => {
    if ( req.session.isAuthenticated ) {
        next()
    } else {
        res.redirect('/login')
    }
}

//login details
const validUname = "Nihala__"
const validPwd = "nih1234"

//routes
app.get ('/login' , (req,res) => {
    res.setHeader ( 'Cache-Control','no-store , max-age = 0')
    res.render ('login' , { message : req.session.message } )
})

app.use ( bodyParser.urlencoded ( { extended : true }))

app.post ('/login', (req,res)=> {
    res.setHeader ( 'Cache-Control','no-store , max-age = 0')
    const {username,password} = req.body

    //authentication
    if ( username === validUname && password === validPwd) {
        res.setHeader ( 'Cache-Control','no-store , max-age = 0')
        req.session.isAuthenticated = true
        req.session.message = ' '
        res.redirect ('/home')
    } else {
        req.session.isAuthenticated = false
        req.session.message = "Incorrect username or password"
        res.redirect('/login')
    }
})

app.get ('/home' , checkAuth , (req,res) => {
    res.setHeader ( 'Cache-Control','no-store , max-age = 0')
    res.render ('home')
})

app.get ('/signout',(req , res) => {
    req.session.destroy ( () => {
        res.redirect ('/login')
    })
})

app.listen (4500 , () => {
    console.log ("Server is running on port 4500") ;
})