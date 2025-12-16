const express = require("express");
const app = express();

// -----------------------------------------------------------
app.use(express.static("public/"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.set("view engine", "ejs");

var url = require("url");
// ------------------------------------------------------------
//password hashing bcrypt import
const bcrypt = require("bcrypt");

const connection = require("./config/db");

const patientsschema = require("./model/patientsschema");

const userdataschema = require("./model/userdataschema");

const appointmentschema = require("./model/apointmentschem")

// -----------------------express session step 1------------------------------------------------------

const session = require("express-session");
app.use(
  session({
    secret: "jayesh",
    resave: false,
    saveUninitialized: false,
  })
);

// ------------------------------------------------------------

app.get("/", (req, res) => {
  res.render("home.ejs");
});

// -----------------------------------------------------------

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// -----------------------------------------------------------

app.get("/appointments", async(req, res) => {
  if (req.session._id) {
    try{
      const data=await appointmentschema.find()
      res.render("appointments.ejs",{data :data})
    }catch(err){
      console.log(err);
      res.status(500).send('internal server err')      
    }
  } else {
    res.send(`
      <script>
      alert('your session has been expire pls login again...')
      window.location.assign('/login')
      </script>
      `);
  }
});

// -----------------------------------------------------------

app.post("/appointment",async(req,res)=>{
  // res.render("appointments.ejs")
    try {
    const result = new appointmentschema(req.body);
    //insert
    await result.save();
    console.log("data inserted sucessfully");
    res.send(`
      <script>
      alert('patient added sucessfully ✅')
      window.location.assign('/appointments')
      </script>

      `);
  } catch (err) {
    console.log("data inserted faled", err);
    res.status(500).send("internal server error");
  }
})
// --------------------registration data----------------------------------------

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Asynchronously generates a hash for the given password.
    // Salt length to generate or salt to use
    const hashedpassword = await bcrypt.hash(password, 10);

    const result = new userdataschema({
      username,
      email,
      password: hashedpassword,
    });
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
    res.status(500).send("failed to create a user profile ❌");
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
  //bcrypt password
  const password = await bcrypt.compare(req.body.password, userexist.password);
  if (!password) {
    res.send(`
            <script>
            alert('invalid password ❌')
            window.location.assign('/login')
            </script>
            `);
  } else {
    //session expire step 2
    req.session._id = userexist._id;
    return res.redirect("/dashbord");
  }
});

// -----------------session expire code step 3--------------------------------------------------------

app.get("/dashbord", (req, res) => {
  if (req.session._id) {
    res.render("dashbord.ejs");
  } else {
    res.send(`
      <script>
      alert('your session has been expire pls login again...')
      window.location.assign('/login')
      </script>
      `);
  }
});

// -------------------------------------------------------------------------

app.get("/home.ejs", (req, res) => {
  res.render("home.ejs");
});

// -----------------------------------------------------------

app.get("/registerpage", (req, res) => {
  res.render("registerpage.ejs");
});

// -----------------------------------------------------------

app.get("/doctors", (req, res) => {
  if (req.session._id) {
    res.render("doctors.ejs");
  } else {
    res.send(`
      <script>
      alert('your session has been expire pls login again...')
      window.location.assign('/login')
      </script>
      `);
  }
});

// -----------------------------------------------------------

app.get("/pharmacy", (req, res) => {
  if (req.session._id) {
  res.render("pharmacy.ejs");
  } else {
    res.send(`
      <script>
      alert('your session has been expire pls login again...')
      window.location.assign('/login')
      </script>
      `);
  }
});

// -----------------------------------------------------------

app.get("/profile", (req, res) => {
   if (req.session._id) {
   res.render("profile.ejs");
  } else {
    res.send(`
      <script>
      alert('your session has been expire pls login again...')
      window.location.assign('/login')
      </script>
      `);
  }
});

// -----------------------------------------------------------

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return next(err);
  });
  res.redirect("/login");
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
    res.send(`
      <script>
      alert('patient added sucessfully ✅')
      window.location.assign('/patients')
      </script>

      `);
  } catch (err) {
    console.log("data inserted faled", err);
    res.status(500).send("internal server error");
  }
});

// ----------------------------------------------------------------------

//read operation
app.get("/patients", async (req, res) => {
  if (req.session._id) {
    try {
      const data = await patientsschema.find(); // MongoDB se sab patients la rahe hain
      res.render("patients.ejs", { data }); // EJS me data bhej rahe hain
    } catch (err) {
      console.log("Error loading patients:", err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.send(`
      <script>
      alert('your session has been expire pls login again...')
      window.location.assign('/login')
      </script>
      `);
  }
});

// ----------------------------------------------------------------------
//delete
app.get("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await patientsschema.findByIdAndDelete(id);
    //after deleting go to patients list
    res.redirect("/patients");
  } catch (err) {
    console.log("students delete failed", err);
  }
});

// ----------------------------------------------------------------------
//edit

app.get("/editpatient/:id", async (req, res) => {
  var id = req.params.id;
  //fetch datat from the database
  const result = await patientsschema.findById(id);

  const obj = { data: result };
  res.render("editpatient.ejs", obj);
});

//step 2

app.post("/updatepatient/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await patientsschema.findByIdAndUpdate(id, req.body);
    res.send(`
        <script>
        alert('patients updated sucessfully ✅')
        window.location.assign('/patients')
        </script>
        `);
  } catch (err) {
    console.log("patient details update failed ❌", err);
  }
});
// ---------------fall-back-routing-------------------------------------------------------

// ⚠️ Always put this at the END of all routes
app.use((req, res) => {
  res.status(404).render("404.ejs");
});


// ----------------------------------------------------------------------

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
