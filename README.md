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

<br/>
<b>Admin Login:</b> 
<br/>
ID: yasaman.bahrami@gmail.com
Password: 123456
<br/>
<br/>
<b>Features of M-Car Share system:</b> <br/>
1) Guest users can look for the available cars by location and model.<br/>
2) Guest users can signup in the system and confirm their account via verification email.<br/>
3) Registered members can book cars by preferred model and location.<br/>
4) When member books a car, bill is saved in the system internally.<br/>
5) User can book cars only for 12 hours to ensure having cars in our inventory. <br/>
6) User can see booked cars in the MyCar tab.<br/>
7) When member returns a car, bill is generated to the user.<br/>
8) Member can report the damages in the system.<br/>
9) Member will get discount if there is no damage history.<br/>
10) Admin can add and delete cars in the system.<br/>
11) Admin can check the reported damages.<br/>
12) Admin can track cars.
