# m-carshare
GIT Repository of Group 2

Team members: <br/>
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

<b>Features of M-Car Share system:</b>
1) Guest users can look for the available cars by location and model.
2) Guest users can signup in the system and confirm their account via verification email.
3) Registered members can book cars by preferred model and location.
4) When member books a car, bill is saved in the system internally.
5) User can see booked cars in the MyCar tab.
6) When member returns a car, bill is generated to the user.
7) Member can report the damages in the system.
8) Member will get discount if there is no damage history.
9) Admin can add and delete cars in the system.
10) Admin can check the reported damages.
11) Admin can track cars.
