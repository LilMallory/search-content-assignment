## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed on your machine:
- Node.js (version 20.x or compatible) 
- npm (version 10.x or compatible) 

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/LilMallory/search-content-assignment.git
   cd search-content-assignment

2. Install the necessary npm modules:

   ```bash
   npm install --legacy-peer-deps

### Running the Application

1. To start the application locally, use the following command:

   ```bash
   npm run start
   
This will serve the application on http://localhost:3000. Open your browser and navigate to this URL to see the application running.

### Running Automated Tests

2. Playwright is used for automated testing. The test cases are configured to run in parallel and simulated on different browsers. To run the tests, use the following command:

    ```bash
    npm run test

The tests can be run without serving the application locally. The tests are simulated on Google Chrome, Microsoft Edge, Mobile Chrome, and Chromium.