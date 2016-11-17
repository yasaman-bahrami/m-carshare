# m-carshare
GIT Repository of Group 2

Team members:
Yasaman Bahrami Samani, Student #: 201392321 <br/>
Bina Javed, Student #: 201467974 <br/>
Ghassem Alaee Khangha, Student # <br/>

Project Description: 
CarShare company manages a fleet of cars that will be rented to members
<br/>
Please use Firefox for testing the application.<br/>
Chrome has an issue with sharing location of the user due to deprecation of Google MAP API calls on <br/>
insecure channels like our garfield server which is up on http instead of https. <br/>
Below is a URL that describes the issue with Chrome in details: <br/>
https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins

<br/>
To run the mongodb database please issue the following command in the root folder of the checked out code:
<br/>
<b> mongod </b> -smallfiles -nojournal -dbpath {PROJECT_ROOT}\db\
<br/>
To run the application please issue the following commands: <br/>
<br/>
<b>npm</b> install
<br/>
<b>node</b> app.js
