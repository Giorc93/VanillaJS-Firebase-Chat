const buttons = document.querySelector("#buttons");
const userName = document.querySelector("#userName");
const privateContent = document.querySelector("#privateContent");
const form = document.querySelector("#form");
const chatInput = document.querySelector("#chatInput");

//Auht status. Verify user login
//Conditional rendering buttons
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    buttons.innerHTML = /*html*/ `<button class="btn btn-outline-danger" id="logOutBtn">Log Out</button>`;
    userName.innerHTML = user.displayName;

    logOut();

    form.classList =
      "input-group bg-dark p-2 fixed-bottom container rounded-top";

    chatContent(user);
  } else {
    buttons.innerHTML = /*html*/ `<button class="btn btn-outline-success" id="logInBtn">Log In</button>`;

    logIn();

    userName.innerHTML = "Chat";
    privateContent.innerHTML = /*html*/ `
        <p class="text-center lead mt-5">Please Log In</p>
    `;
    form.classList =
      "input-group bg-dark p-2 fixed-bottom container rounded-top d-none";
  }
});

//Creating log in function
const logIn = () => {
  const logInBtn = document.querySelector("#logInBtn");
  logInBtn.addEventListener("click", async () => {
    try {
      //Instance GoogleAuth Provider. Check firebase docs
      var provider = new firebase.auth.GoogleAuthProvider();
      //Once the user logs in the onAuthStateChanged gets the user data
      firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  });
};

//Creating log out function
//DOes not requires async-wait functino because it's not retrieving data. Just
const logOut = () => {
  const logOutBtn = document.querySelector("#logOutBtn");
  logOutBtn.addEventListener("click", () => {
    firebase.auth().signOut();
  });
};

//Creating chat content fn

const chatContent = (user) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!chatInput.value.trim()) {
      console.log("Empty input");
      return;
    }

    //Adding messaged to db
    firebase
      .firestore()
      .collection("chat")
      .add({
        text: chatInput.value,
        uid: user.uid,
        date: Date.now(),
      })
      .then((res) => console.log("Message saved"))
      .catch((err) => console.log(err));

    //Reseting input field
    chatInput.value = "";
  });

  //Real time DB query. onSnapshot is and observable
  //Sorting data using orderBy('criteriaprop')
  firebase
    .firestore()
    .collection("chat")
    .orderBy("date")
    .onSnapshot((querySnapshot) => {
      privateContent.innerHTML = "";
      querySnapshot.forEach((doc) => {
        if (doc.data().uid === user.uid) {
          privateContent.innerHTML += /*html*/ `
            <div class="d-flex justify-content-end">
                <span class="badge rounded-pill bg-primary">
                    ${doc.data().text}
                </span>
            </div>
            `;
        } else {
          privateContent.innerHTML += /*html*/ `
            <div class="d-flex justify-content-start">
                <span class="badge rounded-pill bg-secondary">
                    ${doc.data().text}
                </span>
            </div>
            `;
        }

        //Scrolling down automatically
        privateContent.scrollTop = privateContent.scrollHeight;
      });
    });
};

//Deploy using firebase. Follow inst. from firebase doc

//Remove auth domains localhost and 127.0.0.1

//Web running on firebase. Everytime

//Check security rules on docs
