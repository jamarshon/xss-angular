#XSS-Angular
A website documentation for how to exploit Angular's sandbox through XSS (Cross-Site Scripting)

The site can be found here (https://xss-angular.herokuapp.com/) and it goes through a series of 
examples of which code/situation is safe or not e.g (ng-include, ng-bind-html, concatenation, 
interpolation, etc.)

Currently, it shows Angular version 1.2.16. Any feedback or pull requests are welcome!

##Setup
Run the following commands in your command prompt
1. git clone https://github.com/jamarshon/xss-angular.git
2. cd xss-angular
3. npm install
4. npm start

The site should be running on http:localhost:3000

To run in production first type into your command prompt "gulp" to minify the files
followed by "npm run p".