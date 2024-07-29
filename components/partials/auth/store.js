import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const initialUsers = () => {
  if (typeof window !== "undefined") {
    const item = window.localStorage.getItem("users");
    return item
      ? JSON.parse(item)
      : [
          {
            id: uuidv4(),
            name: "dashcode",
            email: "dashcode@gmail.com",
            password: "dashcode",
          },
          {
            id: uuidv4(),
            name: "admin",
            email: "admin@gmail.com",
            password: "admin",
          },
        ];
  }
  return [
    {
      id: uuidv4(),
      name: "dashcode",
      email: "dashcode@gmail.com",
      password: "dashcode",
    },
    {
      id: uuidv4(),
      name: "admin",
      email: "admin@gmail.com",
      password: "admin",
    },
  ];
};

const initialIsAuth = () => {
  if (typeof window !== "undefined") {
    const item = window.localStorage.getItem("isAuth");
    return item ? JSON.parse(item) : false;
  }
  return false;
};

const initialUserData = () => {
  if (typeof window !== "undefined") {
    const item = window.localStorage.getItem("userData");
    return item ? JSON.parse(item) : { user: null, companies: [] };
  }
  return { user: null, companies: [] };
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login/`, data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Invalid credentials";
      return rejectWithValue(errorMessage);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    users: initialUsers(),
    isAuth: initialIsAuth(),
    userData: initialUserData(),
  },
  reducers: {
    handleRegister: (state, action) => {
      const { name, email, password } = action.payload;
      const user = state.users.find((user) => user.email === email);
      if (user) {
        toast.error("User already exists", {
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
        state.users.push({
          id: uuidv4(),
          name,
          email,
          password,
        });
        if (typeof window !== "undefined") {
          window.localStorage.setItem("users", JSON.stringify(state.users));
        }
        toast.success("User registered successfully", {
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
    },
    handleLogout: (state) => {
      state.isAuth = false;
      state.userData = { user: null, companies: [] };
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("isAuth");
        window.localStorage.removeItem("userData");
      }
      toast.success("User logged out successfully", {
        position: "top-right",
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.userData = action.payload;
        if (typeof window !== "undefined") {
          window.localStorage.setItem("isAuth", JSON.stringify(state.isAuth));
          window.localStorage.setItem("userData", JSON.stringify(state.userData));
        }
        toast.success("User logged in successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuth = false;
        state.userData = { user: null, companies: [] };
        toast.error(action.payload, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  },
});

export const { handleRegister, handleLogout } = authSlice.actions;
export default authSlice.reducer;
