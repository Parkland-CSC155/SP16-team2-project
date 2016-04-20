# SP16-team2-project

//dipty was here
JSON-based API

The JSON-based API should handle the following URL patterns: 

• /api/search/{searchText}?page={pageNumber}&apiKey={apiKey}  returns an array of nutrition items matching the  searchText  (broken into 25 record pages)


• /api/list?page={pageNumber}&apiKey={apiKey}  returns an ordered list of nutrition items broken into 25 record pages


• /api/{id}&apiKey={apiKey}  returns a specific nutrition item by id


•each request to an API URL should be inspected to contain a valid  apiKey . It is up to you how you determine what a 'valid'  apiKey  is
◦your server should return a  401  status if no  apiKey  is present or the  apiKey  is invalid


Web Application/Web Site
•A login page. Users must authenticate in order to gain access to the rest of the site pages
•A logout page.
•A list page of nutrition items ordered alphabetically, broken into 25 record pages ◦users must be authenticated before going to this page
◦the page should support searching on the name of items
◦the page should have buttons to allow moving through the pages of data. See Here for some good guidance

•A page that allows viewing individual nutrition items with their full nutrition information ◦users must be authenticated before going to this page


Calculator Area

The calculator area will effectively be another page in the website, but it will have additional functionality than most of the other pages, specifically in that it will: 
•Allow a user to search and select multiple nutrition items and have the page display the totaled nutrition facts
•Allow a user to select multiples of portion sizes and have the page display the totaled nutrition information
•A user must be authenticated to see the page
•a good example of functionality can be found Here
