//Book Class: Represents a book......
class Book {
    constructor(title, author, isbn) { /*we'll na take these parameters and assign it to the property of that object using this keyword*/
        this.title = title // this.title will be set to whatever title thats passed in up
        this.author = author
        this.isbn = isbn
    }
}

//UI Class: Handle UI class.......
class UI {
    static displayBooks (){ //mtd    UI.displaybooks.. how we called it below
        // const books = storedBooks
        const books = Store.getBooks() //will get dem for us from the local storage and return them

        books.forEach((book) => UI.addBookToList(book))
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list')

        const row = document.createElement('tr')
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row)
    }

    static deleteBook(targetDeleteElement){
        if (targetDeleteElement.classList.contains('delete')){
            targetDeleteElement.parentElement.parentElement.remove()
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div')
        div.className = `alert alert-${className}` // variable syntax ${className}
        div.appendChild(document.createTextNode(message))
        //set where to put the new element in the DOM
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        container.insertBefore(div, form) /*Insert the div b4 the form.. container is the parent*/
        //vanish in 3 secs
        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 3000)
    }

    static clearFields(){
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#isbn').value = ''
    }


}

//Store Class: Handle Storage .. stores in the broswer
class Store{
    static getBooks(){ //make them static so we can call them directly without having to instantiate the Store class
        let books;
        if (localStorage.getItem('books') === null){
            books = []
        }else{
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books
    }

    static addBook(book){ //u cant store objects in local storage, it has to be a string ie. stringify it
        const books = Store.getBooks() //geting books from localStorage
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn){
        const books = Store.getBooks()
        books.forEach((book, index)=> {
            if(book.isbn === isbn){
                books.splice(index, 1) //the index, how many we're splicing
            }
        })
        localStorage.setItem('books', JSON.stringify(books)) //item we're setting is books and we wanna pass in books
    }

}



//Event: Display books.......
document.addEventListener('DOMContentLoaded', UI.displayBooks)


//Event: Add a book.........
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //Prevent submit 
    e.preventDefault()
    //Get Form Values
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const isbn = document.querySelector('#isbn').value
    //Validate
    if (title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill all fields..', 'danger') /**alert- has been specified up */
    } else{
        //Instantiate books
        const book = new Book(title, author, isbn)
        console.log(book);
        //Add Book To UI
        UI.addBookToList(book)
        //Add Book to store.. see it in chrome dev tool -application-storage-local storage- Key: value
        Store.addBook(book)
        //Show success message
        UI.showAlert('Book added to the list', 'success')
        //Clear fields
        UI.clearFields()
    }


})


//Event: Remove a book ........ both in the UI and storage
document.querySelector('#book-list').addEventListener('click', (e) => {
    // console.log(e.target); /* this will give show what was clicked on that element.. ie.... <a href="#" class="btn btn-danger btn-sm delete">X</a>*/
    //Remove book from UI
    UI.deleteBook(e.target)

    //Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
    //Delete alert
    UI.showAlert('Book successfuly deleted!', 'danger')
})