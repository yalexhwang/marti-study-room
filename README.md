# Marti's Study Room

Marti's Study Room has been rebuilt from the original(https://github.com/yalexhwang/Marti-vocab-study), as a complete web application with a database connection. 
My student can review vocabulary, manage words in the database, or take a quiz. 
Quiz Results are saved to the database in order to track her progress over time.

<link>www.yalexhwang.com/marti-study-room</link>

<a href="https://youtu.be/CSgIH1--ssM" target="_blank"><img src="http://www.yalexhwang.com/img-stash/demo-marti-thumb.png" width="460" height="auto"></a>

##Technologies & Frameworks 
- HTML
- CSS/SASS
  - Compass
- Bootstrap
- JavaScript
- AngularJS
- Express.js with Node.js
- MongoDB/Mongoose

##Basic Functionality
- Home
  - Review vocabulary in a flash card format 
  - Hide part(s) of the flash card to practice memorization
  - Specify a category (verbs, nouns, etc)
  - Shuffle the order 
  
<img src="http://www.yalexhwang.com/compass/images/m1.png" width="460" height="auto">

- Quiz 
  - Adjust the default quiz settings to a user's liking: number of questions, vocabulary category, number of answer options, and timed (TBA)
  - Complete a quiz and review the results: a list of questions that a user did not get right is displayed with the correct answer
  - Upon clikcing 'OK', the results of the quiz is sent to the DB and saved under the user's record
  - Each word on the quiz is updated with the result as well: +1 for the correct answer, -1 for the incorrect answer; for later use to review words by previous results
  
<img src="http://www.yalexhwang.com/compass/images/m2.png" width="460" height="auto">

<img src="http://www.yalexhwang.com/compass/images/m3.png" width="460" height="auto">

- Word Bank
  - Add or remove a word
  - See words available in the DB in a table form
  
<img src="http://www.yalexhwang.com/compass/images/m4.png" width="460" height="auto">

##Code Snippets
<img src="http://www.yalexhwang.com/img-stash/snippet-marti-1.png" width="440" height="auto">

<img src="http://www.yalexhwang.com/img-stash/snippet-marti-2.png" width="440" height="auto">

<img src="http://www.yalexhwang.com/img-stash/snippet-marti-3.png" width="520" height="auto">

<img src="http://www.yalexhwang.com/img-stash/snippet-marti-4.png" width="520" height="auto">

##Notes
- **Nested ngRepeat**: A quiz is generated using ngRepeat on `$scope.quizList`, an array of objects, each of which represents
a quiz question. Because a quiz question comes with multiple answer options, the object has a property answerOptions, 
which in turn is an array of objects. So, a ngRepeat directive is used to iterate over the array `$scope.quizList` 
to populate questions. Then, another ngRepeat, nested inside of the first ngRepeat, loops through the array of answer options
that belongs to the quiz question object, populating answer options for the question. Because of the rather complicated data 
structure, it was tricky to place the directives properly within DOM elements while keeping track of `$index` from both arrays.
- **Consecutive AJAX Requests on Array**: Each word in the database is tracked with quiz records, whether a student answered 
the word in question correctly or not. A service method `WordBankService.updateWordRecord` returns a deferred promise, 
which is resolved or rejected depending on return value of an AJAX call it makes. Because several words need to be updated 
at once, they are passed to the service as an array, prompting the service to make consecutive AJAX calls.`$q.all` was used 
to make sure all requests are returned before calling the callback function.
- **Opening a Port**: When the application was deployed to my server initially, no data was being returned from the database. 
The application was listening to port 3000, the default value set by Express generator. It turned out that port 3000 was 
already in use by another application on my server. I opened another port and allowed inbound traffic to it on AWS.

##Ideas for Future Implementation
- **Quiz Option - Timed feature**: Record a total time taken to completed the quiz, or set a time limit 
- **Customization - background**: Allow a user to upload a photo to be used as the background of the app
- **Ver.3**: Refatoring in OOP

