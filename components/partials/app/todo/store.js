import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { configureStore } from "@reduxjs/toolkit";

import { toast } from "react-toastify";
import axios from "axios";
import thunk from "redux-thunk";

export const appTodoSlice = createSlice({
  name: "apptodo",
  initialState: {
    todos: [],
    filter: "all",
    addModal: false,
    editModal: false,
    todoSearch: "",
    isLoading: false,
    editItem: {},
    trashTodo: [],
    todoSearch: "",
    mobileTodoSidebar: false,
    projectId: 0, // Rename id to projectId:0
    taskId: 0,
  },
  reducers: {
    // open add modal
    openAddModal: (state, action) => {
      state.addModal = action.payload.open;
      state.projectId = action.payload.projectId
   },
    fetchTodos: async (state, action) => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${action.payload}/tasks/`
        );
        console.log("Todos fetched:", response.data);
        state.todos = response.data;

        return response.data;
      } catch (error) {
        console.error(
          "Error fetching todos:",
          error.response ? error.response.data : error.message
        );
        throw error;
      }
    },

    addTodo: async (state, action) => {
      console.log(state.id);
      const formData = new FormData();
      formData.append("title", action.payload.title);
      formData.append("category", action.payload.category);
      formData.append("project_id", state.projectId);

      try {
        // Send a POST request to create a new task
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${state.projectId}/tasks/`,
          formData
        );
        console.log("Task created:", response.data);
        // Optionally, you can redirect or show a success message here
        toast.success("Task create successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return response.data;
      } catch (error) {
        console.error("Error:", error.response.data);
        throw error;
      }
      // state.todos.unshift(action.payload);
      // toast.success("Add Successfully", {
      //   position: "top-right",
      //   autoClose: 1500,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      // });
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },

    setTodos(state, action) {
      state.todos = action.payload;
    },
    deleteTodo: async (state, action) => {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${action.payload}/delete/`
        );
        toast.error("Delete Successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return taskId;
      } catch (error) {
        console.error(
          "Error deleting task:",
          error.response ? error.response.data : error.message
        );
        throw error;
      }
    },
    editTodo: (state, action) => {
      state.todos.findIndex((item) => {
        if (item.id === action.payload.id) {
          state.editItem = item;
          state.editModal = !state.editModal;
          state.taskId = action.payload.id;
        }
      });
    },
    isCheck: (state, action) => {
      const updateTaskIsDone = async (taskId, isDone) => {
        console.log(isDone);
        try {
          const response = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}/is_done/`,
            { is_done: !isDone }
          );
          console.log("Task isDone updated:", response.data);

          if (isDone === true) {
            toast.warning("task need more Work", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          } else {
            toast.warning("task Completed", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
          setTimeout(() => {
            window.location.reload();
          }, 1500);

          return response.data;
        } catch (error) {
          console.error(
            "Error updating task isDone:",
            error.response ? error.response.data : error.message
          );
          throw error;
        }
      };
      state.todos = state.todos.map((todo) =>
        todo.id === action.payload
          ? updateTaskIsDone(todo.id, todo.is_done)
          : todo
      );
    },
    isFaveCheck: (state, action) => {
      state.todos = state.todos.map((todo) =>
        todo.id === action.payload ? { ...todo, isfav: !todo.isfav } : todo
      );
    },
    // search todo
    setSearch: (state, action) => {
      state.todoSearch = action.payload;
    },
    // mobile todo sidebar
    toggleMobileTodoSidebar: (state, action) => {
      state.mobileTodoSidebar = action.payload;
    },
    closeEditModal: (state, action) => {
      state.editModal = action.payload;
    },
  },
});

export const {
  addTodo,
  setFilter,
  openAddModal,
  deleteTodo,
  editTodo,
  isCheck,
  isFaveCheck,
  setSearch,
  toggleMobileTodoSidebar,
  closeEditModal,
  setTodos,
  projectId,
  fetchTodos,
  taskId,
} = appTodoSlice.actions;

export default appTodoSlice.reducer;
