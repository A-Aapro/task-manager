export const userService = {
  userAuth,
  getUserData,
  getAllUsers,
  deleteAccount,
  deleteAuth,
};

async function userAuth(userData) {
  try {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
        process.env.VUE_APP_AUTH_KEY,
      {
        method: "POST",
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          returnSecureToken: true,
        }),
      }
    );
    const responseData = await response.json();
    if (responseData.error) {
      throw new Error("Kirjautuminen epäonnistui");
    }
    return responseData;
  } catch (e) {
    return new Error(e.message);
  }
}

async function getUserData(localId, idToken) {
  try {
    const response = await fetch(
      "https://kuuki-task-manager-default-rtdb.europe-west1.firebasedatabase.app/users/" +
        localId +
        ".json?auth=" +
        idToken,
      {
        method: "GET",
      }
    );
    if (response.error) {
      throw new Error("Virhe käyttäjän haussa");
    }
    const responseData = await response.json();
    return responseData;
  } catch (e) {
    return e;
  }
}

async function getAllUsers(idToken) {
  try {
    const response = await fetch(
      "https://kuuki-task-manager-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=" +
        idToken,
      {
        method: "GET",
      }
    );
    const responseData = await response.json();

    return responseData;
  } catch (e) {
    return e;
  }
}

async function deleteAccount(payload) {
  try {
    const response = await fetch(
      "https://kuuki-task-manager-default-rtdb.europe-west1.firebasedatabase.app/users/" +
        payload.userId +
        ".json?auth=" +
        payload.idToken,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Jotain meni vikaan");
    }
    return response;
  } catch (e) {
    return new Error(e.message);
  }
}
async function deleteAuth(payload) {
  try {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:delete?key=" +
        process.env.VUE_APP_AUTH_KEY,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken: payload }),
      }
    );
    if (!response.ok) {
      throw new Error("Jotain meni vikaan");
    }
    return response;
  } catch (e) {
    return new Error(e.message);
  }
}
