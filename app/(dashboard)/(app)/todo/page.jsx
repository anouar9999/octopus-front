"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";

import Button from "@/components/ui/Button";
import SimpleBar from "simplebar-react";
import { useSelector, useDispatch } from "react-redux";
import {
  openAddModal,
  setFilter,
  setTodos,
  setSearch,
  toggleMobileTodoSidebar,
} from "@/components/partials/app/todo/store";
import Todos from "@/components/partials/app/todo/Todos";
import AddTodo from "@/components/partials/app/todo/AddTodo";
import { ToastContainer } from "react-toastify";
import EditTodoModal from "@/components/partials/app/todo/EditTodo";
import Topfilter from "@/components/partials/app/todo/Topfilter";
import BottomFilter from "@/components/partials/app/todo/BottomFilter";
import ListLoading from "@/components/skeleton/ListLoading";
import Badge from "@/components/ui/Badge";
import TodoHeader from "@/components/partials/app/todo/TodoHeader";
import useWidth from "@/hooks/useWidth";
import { isAdmin } from "@/constant/data";
import axios from "axios";

const topfilterList = [
  {
    value: "all",
    name: "My Task",
    icon: "uil:image-v",
  },

  {
    value: "done",
    name: "Completed",
    icon: "heroicons:document-check",
  },
];

const bottomfilterList = [
  
  {
    name: "low",
    value: "low",
  },
  {
    name: "medium",
    value: "medium",
  },
  {
    name: "high",
    value: "high",
  },
  {
    name: "update",
    value: "update",
  },
];

const TodoPage = ({ id }) => {
  const [Tasks, setTasks] = useState([]);

  const { todos, editModal, filter, todoSearch, mobileTodoSidebar } =
    useSelector((state) => state.todo);
  const { width, breakpoints } = useWidth();
  const userData = useSelector((state) => state.auth.userData);

  const dispatch = useDispatch();
  const isAdmin = userData?.user?.is_admin || false;
    const fetchTodos = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}/tasks/`
      );
      console.log("Todos fetched:", response.data);
      setTasks(response.data);
      dispatch(setTodos(response.data));

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching todos:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };
  useEffect(() => {
    fetchTodos(id);
  }, []);
  const [isLoading, setLoading] = useState(false);

  const filteredTodos = todos
    // search filteredTodos
    .filter((todo) => {
      // filter based on searchTerm
      if (todoSearch) {
        return todo.title.toLowerCase().includes(todoSearch.toLowerCase());
      }
      return true;
    })
    .filter((todo) => {
      if (filter === "all") {
        return todo;
      } else if (filter === "fav") {
        return todo.isfav;
      } else if (filter === "done") {
        return todo.is_done;
      } else if (filter === "low") {
        return todo.category === "low";
      } else if (filter === "medium") {
        return todo.category === "medium";
      } else if (filter === "high") {
        return todo.category === "high";
      } else if (filter === "update") {
        return todo.category === "update";
      }
    });

  // search filteredTodos

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);

    if (width < breakpoints.lg && mobileTodoSidebar) {
      dispatch(toggleMobileTodoSidebar(false));
    }
  }, [filter]);

  const handleFilter = (filter) => {
    dispatch(setFilter(filter));
  };

  return (
    <>
      <ToastContainer />

      <div className="flex md:space-x-5 app_height overflow-hidden relative p-3 rtl:space-x-reverse">
        <div
          className={`transition-all duration-150 flex-none min-w-[260px] 
        ${
          width < breakpoints.lg
            ? "absolute h-full top-0 md:w-[260px] w-[200px] z-[999]"
            : "flex-none min-w-[260px]"
        }
        ${
          width < breakpoints.lg && mobileTodoSidebar
            ? "left-0 "
            : "-left-full "
        }
        `}
        >
          <Card
            bodyClass=" h-full flex flex-col"
            className="h-full bg-white"
          >
            {isAdmin && (
              <div className="flex-1 h-full py-2 px-6">
                <Button
                  icon="heroicons-outline:plus"
                  text="Add Task"
                  className="btn-dark w-full block  "
                  onClick={() =>
                    dispatch(openAddModal({ open: true, projectId: id }))
                  }
                />
              </div>
            )}

            <SimpleBar className="h-full px-6 ">
              <ul className="list mt-6">
                {topfilterList.map((item, i) => (
                  <Topfilter
                    filter={filter}
                    item={item}
                    key={i}
                    onClick={() => handleFilter(item.value)}
                  />
                ))}
              </ul>

              <div>
                  <div className="block py-4 text-slate-800 dark:text-slate-400 font-semibold text-xs uppercase">
                  Priority
                  </div>
                  <ul>
                    {bottomfilterList.map((item, i) => (
                      <BottomFilter
                        filter={filter}
                        item={item}
                        key={i}
                        onClick={() => handleFilter(item.value)}
                      />
                    ))}
                  </ul>
                </div>
            </SimpleBar>
          </Card>
        </div>
        {/* overlay */}
        {width < breakpoints.lg && mobileTodoSidebar && (
          <div
            className="overlay bg-slate-900 dark:bg-slate-900 dark:bg-opacity-60 bg-opacity-60 backdrop-filter
         backdrop-blur-sm absolute w-full flex-1 inset-0 z-[99] rounded-md"
            onClick={() =>
              dispatch(toggleMobileTodoSidebar(!mobileTodoSidebar))
            }
          ></div>
        )}
        <div className="flex-1 md:w-[calc(100%-320px)]">
          <Card bodyClass="p-0  h-full" className="h-full bg-white">
            <SimpleBar className="h-full all-todos overflow-x-hidden">
              <TodoHeader
                onChange={(e) => dispatch(setSearch(e.target.value))}
              />

              {isLoading && <ListLoading count={filteredTodos.length} />}
              {!isLoading && (
                <ul className="divide-y divide-slate-100 dark:divide-slate-700 -mb-6 h-full">
                  {filteredTodos.map((todo, i) => (
                    <Todos key={i} todo={todo} projectId={id} />
                  ))}
                  {filteredTodos.length === 0 && (
                    <li className="mx-6 mt-6">
                      <Badge
                        label="No Result Found"
                        className="bg-danger-500 text-white w-full block text-start"
                      />
                    </li>
                  )}
                </ul>
              )}
            </SimpleBar>
          </Card>
        </div>
      </div>
      <AddTodo />
      <EditTodoModal id={id} />
    </>
  );
};

export default TodoPage;
