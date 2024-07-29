import { createSlice } from "@reduxjs/toolkit";

import { toast } from "react-toastify";
import axios from "axios";

export const appPortalSlice = createSlice({
  name: "appPortal",
  initialState: {
    todos: [],
    filter: "all",
    openModal: false,
    RegionModel: false,
    editModal: false,
    editCity: false,
    editSubCategorie: false,
    editcategorie: false,
    CommentModel: false,
    imageId:null,
    InfoModel: false,
    InfoImage:null,
    descriptionImg:null,
    UploadModel: false,
    todoSearch: "",
    isLoading: false,
    editItem: {},
    trashTodo: [],
    todoSearch: "",
    mobileTodoSidebar: false,
    projectId: 0, // Rename id to projectId:0
    taskId: 0,
    categoryId: null,
    CityID: 0,
  },
  reducers: {
    // open add modal
    openPortalModal: (state, action) => {
      console.log(state.openModal);
      state.openModal = action.payload.open;
    },
    openRegionModal: (state, action) => {
      console.log(state.RegionModel);
      state.RegionModel = action.payload.open;
      state.CityID = action.payload.CityID;
    },
    openCommentModal: (state, action) => {
      console.log(state.CommentModel);
      state.CommentModel = action.payload.open;
      state.imageId = action.payload.imageId;
console.log(state.imageId)
    },
   

    openInfoModal: (state, action) => {
      console.log(state.CommentModel);
      state.InfoModel = action.payload.open;
      state.InfoImage = action.payload.image;
      state.descriptionImg = action.payload.desc;
    },
    openUploadModal: (state, action) => {
      state.UploadModel = action.payload;
      console.log(state.UploadModel);
    },

    deletePortal: async (state, action) => {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${action.payload.categoryId}/`
        );
        if (response.status === 204) {
          console.log("Portal deleted successfully");
          
          toast.error("Portal deleted successfully", {
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
          }, 1600);
        } else {
          console.error("Error deleting portal:", response.data);
          // Handle the error according to your application's requirements
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        // Handle the error according to your application's requirements
      }
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
    editPortalModel: (state, action) => {
      state.editModal = action.payload.open;
      console.log(state.editModal);
      state.categoryId = action.payload.categoryId;
      console.log(state.categoryId);
    },
    editCityModel: (state, action) => {
      state.editCity = action.payload.open;
      console.log(state.editCity);
      state.CityID = action.payload.CityID;
      console.log(state.CityID);
    },
    editSubCategorieModel: (state, action) => {
      state.editSubCategorie = action.payload.open;
      console.log(state.editSubCategorie);
      state.categoryId = action.payload.categoryId;
      console.log(state.categoryId);
    },
    editcategorieModel: (state, action) => {
      state.editcategorie = action.payload.open;
      console.log(state.editSubCategorie);
      state.categoryId = action.payload.categoryId;
      console.log(state.categoryId);
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
    deleteSubPortal: async (state, action) => {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${action.payload.subCategoryName}/subcategories/${action.payload.subCategoryId}/`
        );
        if (response.status === 204) {
          console.log("Sub-Portal deleted successfully");
          toast.error("Sub-Portal deleted  successfully", {
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
        } else {
          console.error("Error deleting project:", response.data);
          // Handle the error according to your application's requirements
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        // Handle the error according to your application's requirements
      }
    },
    deleteCity: async (state, action) => {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/subcategories/${action.payload.subCategoryName}/cities/${action.payload.CityID}/`
        );

        if (response.status === 204) {

          console.log("City deleted successfully");
          toast.error("City deleted  successfully", {
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
        } else {
          console.error("Error deleting project:", response.data);
          // Handle the error according to your application's requirements
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        // Handle the error according to your application's requirements
      }
    },
    deleteRegion: async (state, action) => {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${action.payload.CityName}/regions/${action.payload.regionID}/`
        );

        if (response.status === 204) {
          console.log("region deleted successfully");
          toast.error("Region deleted  successfully", {
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
        } else {
          console.error("Error deleting project:", response.data);
          // Handle the error according to your application's requirements
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        // Handle the error according to your application's requirements
      }
    },
  },
});

export const {
  addTodo,
  setFilter,
  openPortalModal,
  deleteTodo,
  editPortalModel,
  isCheck,
  isFaveCheck,
  setSearch,
  toggleMobileTodoSidebar,
  closeEditModal,
  setTodos,
  projectId,
  fetchTodos,
  taskId,
  openModal,
  editModal,
  categoryId,
  deletePortal,
  deleteSubPortal,
  deleteCity,
  deleteRegion,
  CommentModel,
  openCommentModal,
  imageId,
  InfoModel,
  openInfoModal,
  UploadModel,
  openUploadModal,
  openRegionModal,
  RegionModel,
  editCity,
  CityID,
  editCityModel,
  editSubCategorieModel,
  editSubCategorie,
  editcategorieModel,
  editcategorie,
  InfoImage,descriptionImg
} = appPortalSlice.actions;

export default appPortalSlice.reducer;
