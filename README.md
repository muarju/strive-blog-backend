# Strive Blog REST API Backend
Here I have created a set of WebAPIs for <a href="https://strive-blog-template.netlify.app/"> strive blog application</a>. 

In This application we can create author, edit author, delete author, listing of blog authors

### Authors should have following information:

* name
* surname
* ID (Unique and server generated)
* email
* date of birth
* avatar (e.g. https://ui-avatars.com/api/?name=John+Doe)
* createdAt (server generated)

### The backend should include the following routes:

* GET /authors => returns the list of authors
* GET /authors/123 => returns a single author
* POST /authors => create a new author
* PUT /authors/123 => edit the author with the given id
* DELETE /authors/123 => delete the author with the given id

The persistence must be granted via file system (es.: Json file with a list of authors inside)