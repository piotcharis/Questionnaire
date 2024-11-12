# Survey App

This is a survey app that allows users to answer questions and for admins to view the responses and view, edit, and delete the questions. The app is built using React and Vite.

## Scan the QR code to view the live website

<img src="qr.svg" alt="qr-code" width=200 />

## [piotopoulos.com](https://piotopoulos.com)

The main page of the app is the survey page where users can answer questions one by one. The questions can be of different types such as text, multiple choice, multiple select and scale and they can include images or videos.

## [piotoptoulos.com/admin](https://piotopoulos.com/admin)

The admin page is where admins can view, edit, and delete the questions. The questions can be viewed on a table and the admin can click on a question to view the details and edit them or delete the question. The admin can also add new questions by completing the form. This page is protected by a password to prevent unauthorized access.

## [piotopoulos.com/dashboard](https://piotopoulos.com/dashboard)

The dashboard page is where users can view the responses to the questions. The responses are displayed in bar charts (for multiple choice, scale and multiple select questions) and in a list (for text questions). The user can also export the responses to a CSV file and see the total number of responses.

# Database

The app uses a MySQL database to store the questions and responses. The database has two tables:

## questions

The questions table has the following columns:

| Column                | Description                                                                                    | Type                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **id**                | The ID of the question                                                                         | Integer (PRIMARY KEY)                                       |
| **question_text**     | The text of the question                                                                       | String                                                      |
| **question_type**     | The type of the question (text, multiple choice, multiple select)                              | ENUM("text", "multiple_choice", "multiple_select", "scale") |
| **options**           | The options of the question (for multiple choice and multiple select questions) in JSON format | JSON                                                        |
| **next_question_yes** | The ID of the next question if the answer is yes                                               | Integer                                                     |
| **next_question_no**  | The ID of the next question if the answer is no                                                | Integer                                                     |
| **url**               | The URL of the media (image or video) associated with the question                             | String                                                      |
| **media_title**       | The title of the media                                                                         | String                                                      |
| **other**             | Whether the question has an "Other please specify" option                                      | Boolean                                                     |
| **reason**            | Whether the question has a "If No please specify" field                                        | Boolean                                                     |
| **label**             | The keyword for scale questions (e.g., "useful", "easy", "satisfying")                         | String                                                      |
| **section_title**     | The title of the section the question belongs to                                               | String                                                      |
| **media**             | The type of media (image or video)                                                             | ENUM("image", "video")                                      |

## responses

The responses table has the following columns:

| Column          | Description                                    | Type                  |
| --------------- | ---------------------------------------------- | --------------------- |
| **id**          | The ID of the response                         | Integer (PRIMARY KEY) |
| **question_id** | The ID of the corresponding question           | Integer (FOREIGN KEY) |
| **answer**      | The answer to the question                     | String                |
| **timestamp**   | The timestamp of the response                  | DateTime              |
| **session_id**  | A randomly generated unique ID for the session | String                |

# API

The app uses php endpoints to fetch and send data to the database. The endpoints are:

```bash
POST add_answer.php         # Add an answer to the responses table
POST add_question.php       # Add a question to the questions table
POST check_password.php     # Check if the password is correct
POST delete_questions.php   # Delete a question from the questions table
GET  get_answers.php        # Get all answers from the responses table
GET  get_label.php          # Get the label of a question
GET  get_media.php          # Get the requested media from the media folder
GET  get_questions.php      # Get all questions from the questions table
GET  next_question.php      # Get the next question
GET  previous_question.php  # Get the previous question
PUT  update_question.php    # Update a question in the questions table
POST upload_image.php       # Check if file is the correct type and upload it to the media folder
POST upload_video.php       # Check if file is the correct type and upload it to the media folder
```

# File Structure

```bash
.
├── index.html
├── styles.css
├── vite.config.js
├── package.json
├── yarn.lock
├── public
│   ├── favicon.svg
├── src
│   ├── components
│   │   ├── EditDialog.jsx
│   │   ├── ExportButton.jsx
│   │   ├── Image.jsx
│   │   ├── MultipleChoiceQuestion.jsx
│   │   ├── MultipleSelectQuestion.jsx
│   │   ├── Navbar.jsx
│   │   ├── Password.jsx
│   │   ├── QuestionTable.jsx
│   │   ├── TextQuestion.jsx
│   │   ├── Thanks.jsx
│   │   ├── Video.jsx
│   ├── pages
│   │   ├── Admin.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Main.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── index.jsx

```

# Running the project

To run the project, you need to have Node.js installed. You can download it from [here](https://nodejs.org/).

1. Clone the repository

```bash
git clone
```

2. Install the dependencies

```bash
yarn install
```

3. Run the project

```bash
yarn start
```

The project will be running on [http://localhost:3000](http://localhost:3000).
