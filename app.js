//Book Class: Represents a Book

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn
    }
}

//UI Class: handle UI Tasks
//In UI class, we have methods and these methods will be related
//to handle UI and we dont want to instantiate the UI class
//hence we are making all the method as static
class UI {
    static showInitialTableText = document.querySelector('.no-data');
    static displayBooks() {

        //Dummy Data
        // const StoredBooks = [
        //     {
        //         title: 'Book One',
        //         author: 'John Doe',
        //         isbn: '34343434'
        //     },
        //     {
        //         title: 'Book two',
        //         author: 'John Cena',
        //         isbn: '454545'
        //     }
        // ];

        // const books = StoredBooks;
        const books = Store.getBooks();
        if (books.length === 0) {
            // const showInitialTableText = document.querySelector('.no-data');
            UI.showInitialTableText.classList.add('show');
        }

        books.forEach((book) => {
            UI.addBookToList(book)
        });
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><i class="fas fa-trash btn-trash"></i></td>
        `
        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('btn-trash')) {
            el.parentElement.parentElement.remove();
            UI.showAlert('Book Removed!!!', 'info');
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = 'alert ' + className;
        div.innerText = message;
        const form = document.querySelector('form');
        const formBook = document.querySelector('.book-form');
        form.insertBefore(div, formBook);

        //Vanish in 3 Seconds
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 1500)
    }

    static clearFields() {
        document.querySelector('#title').value = "";
        document.querySelector('#author').value = "";
        document.querySelector('#isbn').value = "";
    }

}

//Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books
    }

    static addBook(book) {
        const books = Store.getBooks();
        if (books.length > 0) {
            UI.showInitialTableText.classList.remove('show');
        }
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        if (books.length === 0) {
            UI.showInitialTableText.classList.add('show');
        }
        localStorage.setItem('books', JSON.stringify(books))
    }
}

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    //Get Form Values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    if (title != "" && author != "" && isbn != "") {
        UI.showInitialTableText.classList.remove('show');
        //Instantiating Book
        const newBook = new Book(title, author, isbn);
        //Adding Book to UI
        UI.addBookToList(newBook);
        Store.addBook(newBook);
        UI.showAlert('Yahooooo! Book Added in a List', 'success');
        UI.clearFields();
    } else {
        UI.showAlert('Please fill in all fields', 'fail')
    }
})

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.innerText);
})