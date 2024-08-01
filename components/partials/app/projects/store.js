import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { toast } from "react-toastify";

export const appProjectSlice = createSlice({
  name: "approject",
  initialState: {
    openProjectModal: false,
    openUploadImageModal:false,
    isLoading: null,
    editItem: {},
    companyID:null,
    editModal: false,
 
  },
  reducers: {
    toggleUploadImageModal: (state, action) => {
      state.openUploadImageModal = action.payload;
    },
    toggleAddModal: (state, action) => {
      state.openProjectModal = action.payload;
    },
    toggleEditModal: (state, action) => {
      state.editModal = action.payload;
    },
    pushProject: (state, action) => {
      state.projects.unshift(action.payload);

      toast.success("Add Successfully", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
    removeProject: (state, action) => {
      state.projects = state.projects.filter(
        (item) => item.id !== action.payload
      );
      toast.warning("Remove Successfully", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
    updateProject: (state, action) => {
      // update project and  store it into editItem when click edit button

      state.editItem = action.payload;
      // toggle edit modal
      state.editModal = !state.editModal;
      // find index
      let index = state.projects.findIndex(
        (item) => item.id === action.payload.id
      );
      // update project
      state.projects.splice(index, 1, {
        id: action.payload.id,
        name: action.payload.name,
        des: action.payload.des,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        assignee: action.payload.assignee,
        progress: action.payload.progress,
        category: action.payload.category,
      });
    },
    ChangecompanyID:(state, action)=>{
      state.companyID = action.payload;

    }
  },
});

export const {
  openModal,
  pushProject,
  toggleAddModal,
  removeProject,
  toggleEditModal,
  updateProject,openUploadImageModal,toggleUploadImageModal,companyID,ChangecompanyID
} = appProjectSlice.actions;
export default appProjectSlice.reducer;
