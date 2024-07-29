import React, { useEffect } from "react";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Checkbox from "@/components/ui/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { deleteTodo, editTodo, isCheck, isFaveCheck, fetchTodos } from "./store";
import axios from "axios";
import { toast } from "react-toastify";

const Tasks = ({ todo, projectId }) => {
  const { id, title, image, is_done, category, isfav } = todo;
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const handleCheck = (id) => {
    return (event) => {
      dispatch(isCheck(id));
    };
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}/delete/`);
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
    } catch (error) {
      console.error('Error deleting task:', error.response);
      throw error;
    }
  };

  return (
    <li className="flex items-center px-6 space-x-4 py-6 hover:-translate-y-1 hover:shadow-todo transition-all duration-200 rtl:space-x-reverse">
      <div>
        <Checkbox value={is_done} onChange={handleCheck(id)} />
      </div>

      <span
        className={`${
          is_done ? "line-through dark:text-slate-300" : ""
        } flex-1 text-sm text-black-600 dark:text-slate-300 truncate`}
      >
        {title}
      </span>

      <div className="flex">
        <span className="flex-none space-x-2 text-base text-secondary-500 flex rtl:space-x-reverse">
          <div className="flex justify-start -space-x-1.5 min-w-[60px] rtl:space-x-reverse">
            {image?.map((img, i) => (
              <div
                key={i}
                className={`${
                  is_done ? "opacity-40" : "opacity-100"
                } h-6 w-6 rounded-full ring-1 ring-secondary-500`}
              >
                <Tooltip placement="top" arrow content={img.label}>
                  <img
                    src={img.image}
                    alt={img.label}
                    className="w-full h-full rounded-full"
                  />
                </Tooltip>
              </div>
            ))}
          </div>

          <div>
            <span
              className={`bg-opacity-20 capitalize font-normal text-xs leading-4 px-[10px] py-[2px] rounded-full inline-block
                ${category === "team" ? "bg-danger-500 text-danger-500" : ""}
                ${category === "low" ? "bg-success-500 text-success-500" : ""}
                ${category === "medium" ? "bg-warning-500 text-warning-500" : ""}
                ${category === "high" ? "bg-primary-500 text-primary-500" : ""}
                ${category === "update" ? "bg-info-500 text-info-500" : ""}
              `}
            >
              {category}
            </span>
          </div>

          <button
            type="button"
            className="text-slate-400"
            onClick={() => dispatch(editTodo(todo))}
          >
            <Icon icon="heroicons-outline:pencil-alt" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(id)}
            className="transition duration-150 hover:text-danger-500 text-slate-400"
          >
            <Icon icon="heroicons-outline:trash" />
          </button>
        </span>
      </div>
    </li>
  );
};

export default Tasks;