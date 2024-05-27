const express = require('express')
const app = express()
const authRouter = require('./routes/authRoutes.js')
const transactionRouter = require('./routes/transactionRoutes.js')
const categoryRouter  = require('./routes/categoryRoutes.js')
const budgetRouter = require('./routes/budgetRoutes.js')
const {DBconnection} = require('./db/db.js')

app.use(express.json())

app.get('/', (req,res) => {
    res.status(400).json("Hello World!")
})


app.use('/user/auth/', authRouter)               
app.use('/user/transactions/', transactionRouter)
app.use('/user/budget/', budgetRouter)
app.use('/user/category/', categoryRouter)


app.listen(9090, async() => {
    try{
    await DBconnection
    console.log('Successfully connected to the DB')
    }
    catch(err){
        console.log(err.message)
    }
    console.log(`Server is running on port ${process.env.PORT}`)
})






