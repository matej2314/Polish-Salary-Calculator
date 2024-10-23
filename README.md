#  **Project: Polish Salary Web Calculator.**

## You can test this project in practice at [http://salarycalc.pl](http://salarycalc.pl).

Used technologies: Node.js, HTML, CSS, JavaScript

# **Description:**

The aim of the project was create salary calculator which calculate net salary in accordance in Polish law for three types of contracts :
a) employment contract,
b) contract of mandate,
c) contract for specific work.

The application was created in cooperation with my best friend who is a specialist in the field of human resources and payroll. She gave me a lot of valuable information about how to perform calculations and how the UI should work.

# **Why this particular technologies?**

Polish Salary Web Calculator was my first (but not last) real project in node.js and Javascript. I've been learning JS since 6 months and this is the most advanced project I have created so far. 

#**How is the App structured?**

## **1. Database**

The project requires to use the database. My choice fell on MySQL, because I know this database and have used it in the past. 

In the project database is used for authenticate users. I've implement login and register mechanism based on JWT. 

## **2. Server/API**

Because it was my first node.js project, I decided to use Express.js. It's simple framework used to build web applications with great written documentation and a lot of tutorials. 

I used Express to make a communication between backend and frontend which I will describe in the next part of this README.

What does data flow look like in the project?

After registering and logging in, the user can select the type of  contract for which he wants to calculate the net salary.

Depending on his choice and declared options, app will display the appropriate calculator. Now user can enter the data: simple description, gross salary and other options important for calculating the salary. Most of them is based on simple 'select' field.

When he clicks 'calculate' button, data go to API endpoint. Now calculations is being performed and user is redirecting to results subpage. This subpage have a function that download data from endpoint when DOM is fully loaded, so when subpage is loaded, user can instantly see the results.

Data flow is identical for all types of contracts and choosed options. 

## **How I solved creating and downloading files?**

## **1.PDF files**

At first I decided to use puppeteer library, but it didn't work because it passed an empty subpage to PDF. So I change used library for PDFKIT. This simple tool allows to download data from endpoint and put it into a file – PERFECT. Why?

In my project data from calculators goes to intermediate API endpoint. So I decided to download them not only in results subpage but also to the function generating the PDF file. (this function also supports pdf endpoint)

Now all I had to do was format the generated file appropriately and the task was done.

## **2. Excel/XLSX files**

Function that allows to generate and download .xlsx files with properly data caused me some problems. First problem was the type of data allows to generate worksheet. It must be an array of data, so....I had transform json to array. 

Another problem was two endpoints used to download the data (one for each calculator). I solved this by using the variable that takes on value of fetched response. It will be always true, but value is always from one endpoint which user used.

## **How to download and install project?**

1. Use `git clone https://github.com/matej2314/Polish-Salary-Calculator.git`
2. Type `npm install`
3. Create your own .env file with MySQL connection data. Database must have to table users with columns: id, name,password, email.
4. Type `npm start`

If you get some errors, try to delete 'node_modules' folder before typing 'npm install'. Remember that project use nodemon and requires MySQL database connection.

