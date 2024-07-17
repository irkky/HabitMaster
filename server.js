const express = require("express")

const app = express();
const mysql = require('mysql2')
const dotenv = require('dotenv')
const path = require('path');

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(express.static('FSWD-PROJECT')); // Replace 'public' with your actual directory

dotenv.config()
const pool = mysql.createPool({
    host : process.env.MYSQL_HOST,
    user :process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
}).promise()

async function createNote(username,email,dob,password){
  const [result] = await pool.query("INSERT INTO users (username, email, dob, password)VALUES (?,?,?,?)",[username,email,dob,password])
  return {id:result.insertId,username, email, dob, password}
}


app.get('/', (req, res) => {
  res.render("index.ejs");
});

app.get('/login', (req, res) => {
  res.render("login.ejs");
});

app.get('/registration', (req, res) => {
  res.render("registration.ejs");
});
app.get('/habits', (req, res) => {
  res.render("habits.ejs");
});

app.post('/register', async (req, res) => {
  const { username, email, dob, password } = req.body;

  try {
      const newUser = await createNote(username, email, dob, password);
      res.json(newUser);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
     // Retrieve user from the database based on the email
     const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

     if (rows.length === 1 && rows[0].password === password) {
        // Successful login
        res.sendStatus(200);
     } else {
        // Invalid credentials
        res.status(401).send('Invalid email or password');
     }
  } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000!!");
});