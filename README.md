# Atom-Chat-Code-Challenge
This repo will tell you how to access the published API
and help you understand how to install this repo and use it locally.


## Access to Published API
**Link to published API**: [atom-code-challenge-api](https://atom-chat-code-challenge-production.up.railway.app/)
### Considerations for accessing the API
* For accessing this api, an **API_KEY** is required, this is done so only 
the reviewer and teammates from atom-chat can access this API.
* The api key should be part of the header as **x-api-key** and then contain the value.
* The api key will be handled directly to Luz or any other teammate from ATOM.
* If the **api key** is not provided an error message will be shown:
    ```JSON 
    {"error":"invalid api key"}
    ```

> Note: The api key is for preventing high traffic in the published API.

## Localhost Installation
### Cross-platform operating systems requirements
* Docker
* Docker Compose
* Node.js 16+
* NPM 9.6.6+

### Installation MacOS & Linux - Docker
Users from Unix-based operating systems will have the luck to simply need to install or use
the **make** command in the terminal.

If the requirements mentioned above are fulfilled the project should install by simply doing:

**MacOS**:
```BASH
make build
```
**Linux**:
```BASH
make build-linux
```


### Installation Windows - Docker
Since Windows normally ships without make, you could install it through chocolate, 
but it will not be covered here.

**It is recommended to use the Powershell**

```BASH
docker compose stop && docker compose build && docker compose run
```

## Raw Installation

1. Install the dependencies.
```BASH
npm install
```
2. Make sure to have **typescript globally installed**.
```BASH
tsc --version
```
3. Run the command npm run dev.
```BASH
npm run dev
```
## Differences Docker vs Raw
1. Docker simulates the exact build that is in the published API.
2. Docker will only contain production needed modules.
3. The Raw installation contains development dependencies.

## Environmental Variables
For the project to be able to run correctly and **.env** file should be created in the root of the project.
It should contain the next env variables some of them won't be provided in this documentation for security reasons.
```bash
# * App related
APP_PORT=3000
APP_API_KEY=

# * Firebase config
FIREBASE_PROJECT_ID=
FIREBASE_TYPE=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
FIREBASE_CLIENT_X509_CERT_URL=
FIREBASE_UNIVERSE_DOMAIN=

# * Used Firebase Emulator unit tests
FIREBASE_CREDENTIALS_PATH="./firebase-credentials.json"
```

## Unit Testing
This project contains unit testing, the testing files can be found in the **tests/** directory.

### Required for unit testing
Since these tests are using firebase emulator and jest, you will need add a json configuration file called **firebase-credentials.json**
in the **config/firebase/** directory.

In the file you will have to add the configuration fields provided in the **serviceAccount.json**.
### Firebase Configuration file
[More information - Add the Firebase Admin SDK to your server ](https://firebase.google.com/docs/admin/setup#:~:text=To%20authenticate%20a%20service%20account,confirm%20by%20clicking%20Generate%20Key.)



### Firebase Emulator
Finally, to run unit testing it is required to have installed firebase-emulator:
[Install Firebase Emulator](https://firebase.google.com/docs/emulator-suite/install_and_configure)

Once firebase emulator is installed, run it with the next command:

```Bash
firebase emulators:start --only firestore --project atomchat-code-challenge
```


### Run Unit Testing
Once everything is up en running, we will need run the command for enabling jest to start testing.
```Bash
npm test 
```