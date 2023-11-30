

const addForm= document.getElementById('add-book-form');
const orderForm= document.getElementById('order-book-form');
const deleteForm= document.getElementById('delete-book-form');
const updateForm= document.getElementById('update-book-form');


const bookOption = document.getElementById('book-option');
const submitButton = document.getElementById('submit-button');

const addedBookDetails = document.getElementById('added-book-details');
const orderedBookDetails = document.getElementById('ordered-book-details');
const updatedBookDetails = document.getElementById('updated-book-details');
const deletedBookDetails = document.getElementById('deleted-book-details');



// Delete Book
        async function deleteBook() {
            let bookDetails = document.createElement('div');
    try{
        const deleteBookId = document.getElementById('delete-book-id').value;
        const response = await axios.delete(`http://localhost:3000/books/delete/${deleteBookId}`);
        console.log('Book deleted successfully:', response.data)
       
        if (response.status=== 200) {
            let message = response.data.message;
            bookDetails.innerHTML = `<h2> The requested book has been deleted</h2>` 
        }
        else{
            bookDetails.innerHTML = `<h2> The requested book could not be deleted</h2>`
        }
        deletedBookDetails.innerHTML = '';
        deletedBookDetails.appendChild(bookDetails);
        deleteForm.style.display = 'none';}
    catch (error) {
        console.error('Error deleting book:', error);
        bookDetails.innerHTML = `<h2> The requested book could not be deleted</h2>`;
        deletedBookDetails.innerHTML = '';
        deletedBookDetails.appendChild(bookDetails);
        deleteForm.style.display = 'none';
    }
}
const deleteBookButton = document.getElementById('delete-book-button');
deleteBookButton.addEventListener('click', deleteBook);



// View all books
async function viewAllBooks() {
    try {
        const response = await axios.get('http://localhost:3000/books');
        const books = response.data;
        let booksContainer = document.createElement('div');
        
        books.forEach(book => {
            let bookDetails = document.createElement('div');
            bookDetails.innerHTML = `
                <h3>Book ID: ${book.id}</h3>
                <p>Author: ${book.author}</p>
                <p>Language: ${book.language}</p>
                <p>Title: ${book.title}</p>
                <hr>
            `;
            booksContainer.appendChild(bookDetails);
        });

        // Append the booksContainer to an existing element in your HTML
        const existingContainer = document.getElementById('books-container');
        existingContainer.innerHTML = '';
        existingContainer.appendChild(booksContainer);

        //console.log('Books fetched successfully');
    } catch (error) {
       // console.error('Error fetching books:', error);
    }
}



// Update Book
async function updateBook() {
    try{
        const updateBookId = document.getElementById('update-book-id').value;
        const author = document.getElementById('update-author').value;
        const language = document.getElementById('update-language').value;
        const title = document.getElementById('update-title').value;
    
        const data = {
            author: author,
            language: language,
            title: title
         };

        const response = await axios.put(`http://localhost:3000/books/update/${updateBookId}`,data) 
        console.log(response.data)
        const message= response.data.message;
        let bookDetails = document.createElement('div');
        bookDetails.innerHTML = `<h2> ${message}</h2>`
        updatedBookDetails.innerHTML = '';
        updatedBookDetails.appendChild(bookDetails);
        
        updateForm.style.display = 'none';
    } catch(error){
        console.error('Error updating book details:', error);
    }
};
const updateBookButton = document.getElementById('update-book-button');
updateBookButton.addEventListener('click', updateBook);




// Order Book
async function orderBook() {
    try{
        const orderBookId = document.getElementById('book-id').value;
        const response = await axios.get(`http://localhost:3000/books/order/${orderBookId}`);
        console.log(response.data);
        const orderedBook = response.data[0];
        orderForm.style.display = 'none';
        if (orderedBook && Object.keys(orderedBook).length > 0) {
            displayOrderedBookDetails(orderedBook);
        } else {
            console.error('Invalid server response:', response);
        } 
    }
    catch(error){
        console.error('Error fetching books:', error);
    };
}
const orderBookButton = document.getElementById('order-book-button');
orderBookButton.addEventListener('click', orderBook);

function displayOrderedBookDetails(orderedBook) {
    let bookDetails = document.createElement('div');
    bookDetails.innerHTML = `
        <h3>Book ID: ${orderedBook.id}</h3>
        <p>Author: ${orderedBook.author}</p>
        <p>Language: ${orderedBook.language}</p>
        <p>Title: ${orderedBook.title}</p>
        <hr>
    `;
    orderedBookDetails.innerHTML = '';
    orderedBookDetails.appendChild(bookDetails);
}




//Add Book
const addBookButton = document.getElementById('add-book-button');
addBookButton.addEventListener('click', async function()
 {
    const author = document.getElementById('author').value;
    const language = document.getElementById('language').value;
    const title = document.getElementById('title').value;

    try {
        const response = await axios.post('http://localhost:3000/add/book', {
            author,
            language,
            title
        });

        const {bookDetails } = response.data;

        if (bookDetails) {
            displayAddedBookDetails(bookDetails);
            addForm.style.display = 'none'
        } else {
            console.error('Invalid server response:', response);
        }
    } catch (error) {
        console.error('Error adding book:', error);
    }
})
function displayAddedBookDetails(addedBook) {
    const bookDetails = document.createElement('div');
    bookDetails.innerHTML = `
        <h2>Book added successfully</h2>
        <h3>Book ID: ${addedBook.id}</h3>
        <p>Author: ${addedBook.author}</p>
        <p>Language: ${addedBook.language}</p>
        <p>Title: ${addedBook.title}</p>
        <hr>
    `;
    addedBookDetails.innerHTML = ''; // Clear existing content before appending the new book details
    addedBookDetails.appendChild(bookDetails);
}



// initiate submit button
submitButton.addEventListener('click', () => {
    const selectedOption = bookOption.value;
    addForm.style.display = 'none'; 
    orderForm.style.display = 'none';
    deleteForm.style.display = 'none';
    updateForm.style.display = 'none';
    
    if (selectedOption === 'view-all') {
        // Perform view all books task
        alert('View all books');
         viewAllBooks()
         .then(() => {console.log('Books fetched successfully')})
         .catch((error) => {
            console.error('Error in viewAllBooks:', error);
        })
    }
    else if(selectedOption === 'add-book') {
        // Perform add book task
        addForm.style.display = 'block';
    }
    else if(selectedOption === 'order-book') {
        // Perform order book task
        orderForm.style.display = 'block';
        
    }
    else if(selectedOption === 'delete-book'){
        // Perform delete book task 
        deleteForm.style.display = 'block';
    }
    else if(selectedOption === 'update-book'){
        // Perform update book task 
        updateForm.style.display = 'block';
    
    }
    else {
        alert('Please select an option');
    }
    });
    