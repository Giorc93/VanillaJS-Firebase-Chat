const buttons = document.querySelector("#buttons");
const userName = document.querySelector("#userName");
const privateContent = document.querySelector("#privateContent");

//Auht status. Verify user login
//Conditional rendering buttons
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    buttons.innerHTML = /*html*/ `<button class="btn btn-outline-danger" id="logOutBtn">Log Out</button>`;
    userName.innerHTML = user.displayName;

    logOut();

    privateContent.innerHTML = /*html*/ `
        <p class="text-center lead mt-5">Welcome ${user.email}</p>
    `;
  } else {
    buttons.innerHTML = /*html*/ `<button class="btn btn-outline-success" id="logInBtn">Log In</button>`;

    logIn();

    userName.innerHTML = "Chat";
    privateContent.innerHTML = /*html*/ `
        <p class="text-center lead mt-5">Please Log In</p>
    `;
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
