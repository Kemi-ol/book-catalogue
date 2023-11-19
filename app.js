
const bodyParser = require('body-parser');
const mysql = require('mysql');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Doncross1!',
    database: 'bookstore',
});

con.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    } else{
    console.log('Connected to MySQL server');
}});

app.use(bodyParser.json());

app.get('/books', (req, res) => {
    con.query('SELECT * FROM books', (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          return;
        }
        else{
        res.json(results);
        console.log(results) };
    })    
})
        // Optionally, you can inspect the fields metadata
    //console.log('Fields metadata:', fields);
      // Close the MySQL connection when the application exits
 process.on('SIGINT', () => {
   connection.end();
   process.exit();
}); 


app.post('/add/book', (req, res) => {
    const { author, language, title} = req.body;
    const sql = 'INSERT INTO books (author, language, title) VALUES (?, ?, ?)';
    con.query(sql, [author, language, title], (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          return;
        }
       
         const insertedBookId = results.insertId;

         // Fetch the most recently inserted book from the database
         const fetchSql = 'SELECT * FROM books WHERE id = ?';
         con.query(fetchSql, [insertedBookId], (fetchError, fetchResults) => {
             if (fetchError) {
                 console.error('Error fetching inserted book:', fetchError);
                 return res.status(500).json({ error: 'Internal Server Error' });
             }
 
             // Send the most recently added book to the frontend
             const mostRecentlyAddedBook = fetchResults[0];
             res.status(201).json({
            message: 'Book added successfully',
             bookDetails: mostRecentlyAddedBook
            });
         });;
    })    
})


app.get('/books/order/:orderBookId', (req, res) => {
    const { orderBookId } = req.params;
    const sql = 'SELECT * FROM books WHERE id = ?';
    con.query(sql, [orderBookId], (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          return;
        }
        if (results.length === 0) {
            // Book not found
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(results);
    })    
})


app.delete('/books/delete/:deleteBookId', (req, res) => {
    const { deleteBookId } = req.params;
    const sql = 'DELETE FROM books WHERE id = ?';
    con.query(sql, [deleteBookId], (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          return;
        }
        if (results.affectedRows === 0) {
            // Book not found
            return res.status(404).json({ message: 'Book not found' });
        }
        else{
        res.json({ message: 'Book deleted successfully' });
        }
    })    
});

app.put('/books/update/:updateBookId', (req, res) => {
    const updatedBookId = req.params.updateBookId;
    const { author, language, title } = req.body;

    const sql = 'UPDATE books SET author = ?, language = ?, title =? WHERE id = ?';
    con.query(sql, [author, language, title, updatedBookId ], (err, result) => {
        if (err) {
            console.error('Error updating book:', err);
            res.status(500).json({ error: 'Error updating book' });
        } else {
            console.log('Book updated successfully');
            res.json({ message: 'Book updated successfully!' });
        }
    });
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});