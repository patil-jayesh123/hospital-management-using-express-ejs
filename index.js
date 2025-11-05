const express = require("express");
const app = express();

// -----------------------------------------------------------
app.use(express.static("public/"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

var url = require("url");
// ------------------------------------------------------------

const connection = require("./config/db");

const patientsschema = require("./model/patientsschema");

const userdataschema = require("./model/userdataschema");

// ------------------------------------------------------------

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// --------------------registration data----------------------------------------

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const result = new userdataschema({ username, email, password });
    await result.save();

    console.log("user profile created sucessfully");

    res.send(`
            <script>
            alert('user added sucessfully ✅')
            window.location.assign('/login')
            </script>
            `);
  } catch (err) {
    console.log("failed to create a user profile ❌", err);
    res.status(500).send("pailed to create a user profile ❌");
  }
});

// --------------------------logine code ----------------------------------

app.post("/login", async (req, res) => {
  const userexist = await userdataschema.findOne({ email: req.body.email });

  if (!userexist) {
    res.send(`
            <script>
            alert('user not found')
            window.location.assign('/login')
            </script>
            `);
  }

  // password validation
  const password = await userdataschema.findOne({ password: req.body.password });
  if (!password) {
    res.send(`
            <script>
            alert('invalid password ❌')
            window.location.assign('/login')
            </script>
            `);
  }

  res.redirect('/dashbord')
});

// -------------------------------------------------------------------------

app.get("/dashbord", (req, res) => {
  res.render("dashbord.ejs");
});

app.get("/home.ejs", (req, res) => {
  res.render("home.ejs");
});

app.get("/registerpage.ejs", (req, res) => {
  res.render("registerpage.ejs");
});

app.get("/doctors.ejs", (req, res) => {
  res.render("doctors.ejs");
});

app.get("/appointments.ejs", (req, res) => {
  res.render("appointments.ejs");
});

app.get("/pharmacy.ejs", (req, res) => {
  res.render("pharmacy.ejs");
});

app.get("/profile.ejs", (req, res) => {
  res.render("profile.ejs");
});

// ----------------------------------------------------------------------

app.post("/saveformp", async (req, res) => {
  // res.send(req.body)
  try {
    const result = new patientsschema(req.body);
    //insert
    await result.save();
    console.log("data inserted sucessfully");
    // res.status(200).send('data inserted sucessfuly')
    res.redirect("/patients.ejs");
  } catch (err) {
    console.log("data inserted faled", err);
    res.status(500).send("internal server error");
  }
});

// ----------------------------------------------------------------------

//read operation
app.get("/patients.ejs", async (req, res) => {
  try {
    const data = await patientsschema.find(); // MongoDB se sab patients la rahe hain
    res.render("patients.ejs", { data }); // EJS me data bhej rahe hain
  } catch (err) {
    console.log("Error loading patients:", err);
    res.status(500).send("Internal Server Error");
  }
});

// ----------------------------------------------------------------------
//delete
app.get("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await patientsschema.findByIdAndDelete(id);
    //after deleting go to patients list
    res.redirect("/patients.ejs");
  } catch (err) {
    console.log("students delete failed", err);
  }
});

// ----------------------------------------------------------------------
//edit

app.get('/editpatient/:id',async(req,res)=>{
var id=req.params.id
//fetch datat from the database
const result=await patientsschema.findById(id)

const obj = {data:result}
res.render("editpatient.ejs",obj)
})


//step 2 

app.post("/updatepatient/:id",async(req,res)=>{
    try{
        const id=req.params.id
        await patientsschema.findByIdAndUpdate(id,req.body)
         res.send(`
        <script>
        alert('patients updated sucessfully ✅')
        window.location.assign('/patients.ejs')
        </script>
        `);
    }catch(err){
        console.log("patient details update failed ❌",err);
    }
})
// ----------------------------------------------------------------------

const PORT = 3000;
const HOST = "127.0.0.1";

app.listen(PORT, HOST, () => {
  console.log(`server is running on http://${HOST}:${PORT}`);
});


