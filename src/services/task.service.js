export const taskService = {
  getAllTasks,
  postTask,
  deleteTask,
  updateTask,
};

async function getAllTasks(idToken) {
  try {
    const response = await fetch(
      "https://kuuki-task-manager-default-rtdb.europe-west1.firebasedatabase.app/tasks.json?auth=" +
        idToken,
      {
        method: "GET",
      }
    );

    const responseData = await response.json();
    return responseData;
  } catch (err) {
    return err;
  }
}

async function postTask(payload) {
  const idToken = payload.idToken;
  const task = payload.task;
  const taskId = payload.task.taskId;
  try {
    const response = await fetch(
      "https://kuuki-task-manager-default-rtdb.europe-west1.firebasedatabase.app/tasks/" +
        taskId +
        ".json?auth=" +
        idToken,
      {
        method: "PUT",
        body: JSON.stringify({
          taskId: task.taskId,
          title: task.title,
          text: task.text,
          tag: task.tag,
          createdAt: task.createdAt,
          dueDate: task.dueDate,
          users: task.users,
        }),
      }
    );

    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(err);
  }
}

async function deleteTask(payload) {
  const idToken = payload.idToken;
  const taskId = payload.taskId;
  try {
    const response = await fetch(
      "https://kuuki-task-manager-default-rtdb.europe-west1.firebasedatabase.app/tasks/" +
        taskId +
        ".json?auth=" +
        idToken,
      {
        method: "DELETE",
      }
    );

    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(err);
  }
}

async function updateTask(payload) {
  const idToken = payload.idToken;
  const task = payload.task;
  const taskId = payload.task.taskId;
  try {
    const response = await fetch(
      "https://kuuki-task-manager-default-rtdb.europe-west1.firebasedatabase.app/tasks/" +
        taskId +
        ".json?auth=" +
        idToken,
      {
        method: "PATCH",
        body: JSON.stringify({
          taskId: task.taskId,
          title: task.title,
          text: task.text,
          tag: task.tag,
          createdAt: task.createdAt,
          dueDate: task.dueDate,
          users: task.users,
        }),
      }
    );

    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(err);
  }
}
