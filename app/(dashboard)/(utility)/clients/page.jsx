"use client";

import React, { useState, useCallback, useLayoutEffect, useMemo } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useRowSelect,
} from "react-table";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import GlobalFilter from "@/components/partials/table/GlobalFilter";
import Tooltip from "@/components/ui/Tooltip";
import '../../../globals.css';
import { useDispatch } from "react-redux";
import { ChangecompanyID } from "@/components/partials/app/projects/store";

const deleteCompany = async (companyId, setClients) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${companyId}/delete/`);
    if (response.status === 204) {
      setClients((prevClients) => prevClients.filter((client) => client.id !== companyId));
      toast.error("Company deleted successfully", {
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
      console.error("Failed to delete company:", response.data);
    }
  } catch (error) {
    console.error("Error deleting company:", error.message);
  }
};
const useFetchCompanies = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCompaniesData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/`);
      if (response.status === 200 && Array.isArray(response.data)) {
        setClients(response.data);
        console.log(response.data);
      } else {
        console.error(`Error fetching companies data: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching companies data:", error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    fetchCompaniesData();
  }, []);

  return { clients, setClients, isLoading };
};

const ActionButton = ({ action, value }) => (
  <button
    onClick={() => action.doit(value)}
    className={`text-white bg-${action.color}-600 hover:bg-${action.color}-700 focus:ring-4 m-1 focus:outline-none focus:ring-${action.color}-300 font-medium rounded-lg text-sm px-2 py-2 text-center inline-flex items-center dark:bg-${action.color}-500 dark:hover:bg-${action.color}-600 dark:focus:ring-${action.color}-700 transition duration-200`}
    type="button"
  >
    <Icon icon={action.icon} />
  </button>
);

const COLUMNS = (actions) => [
  {
    Header: "Nom de la société",
    accessor: "CompanyName",
    Cell: ({ cell: { row: { original } } }) => (
      <div>
        <span className="inline-flex items-center">
          <span className="w-10 h-10 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
            <img
              src={original.CompanyImage }
              alt=""
              className="object-cover w-full h-full rounded-full"
            />
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
            {original.CompanyName}
          </span>
        </span>
      </div>
    ),
  },
  {
    Header: "Adresse E-Mail",
    accessor: "CompanyEmail",
  },
  {
    Header: "Address",
    accessor: "CompanyAddress",
  },
  {
    Header: "Numéro De Téléphone",
    accessor: "CompanyPhoneNumber",
  },
 {
    Header: "clients",
    accessor: "members",
    Cell: ({ cell: { value } }) => (
      <span className="block w-full">
        <div className="flex -space-x-1 overflow-hidden">
          {value.map((client, index) => (
            <Tooltip key={index} placement="top" arrow content={client.MemberFullName}>
              <img
                src={"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                alt={client.MemberFullName}
                className="w-6 h-6 rounded-full"
              />
            </Tooltip>
          ))}
        </div>
      </span>
    ),
  },
  {
    Header: "action",
    accessor: "id",
    Cell: ({ cell: { value } }) => (
      <div className="divide-y divide-slate-100 dark:divide-slate-800 flex space-x-2">
        {actions.map((item, i) => (
          <ActionButton key={i} action={item} value={value} />
        ))}
      </div>
    ),
  },
];

const InvoicePage = () => {
  const { clients, setClients, isLoading } = useFetchCompanies();
  const router = useRouter();
  const dispatch = useDispatch();

  const actions = useMemo(() => [
    {
      name: "portal",
      icon: "heroicons-outline:envelope-open",
      color: "blue",
      doit: (id) => {router.push(`/admin-portal/${id}`),dispatch(ChangecompanyID(id))},
    },
    {
      name: "View",
      icon: "heroicons-outline:eye",
      color: "blue",
      doit: (id) => router.push(`/profile/${id}`),
    },
    {
      name: "edit",
      icon: "heroicons:pencil-square",
      color: "green",
      doit: (id) => router.push(`/client-edit/${id}`),
    },
    {
      name: "delete",
      icon: "heroicons-outline:trash",
      color: "danger",
      doit: (id) => deleteCompany(id, setClients),
    },
  ], [router, setClients]);

  const columns = useMemo(() => COLUMNS(actions), [actions]);
  const data = useMemo(() => clients, [clients]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <div className="">
      <ToastContainer />
      <Card noborder className="p-3 shadow-lg rounded-lg bg-white dark:bg-gray-800">
        <div className="md:flex pb-6 items-center">
          <h6 className="flex-1 md:mb-0 mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">Clients List</h6>
          <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <Button
              icon="heroicons-outline:plus-sm"
              text="Add Client"
              className="btn-dark font-normal btn-sm"
              iconClass="text-lg"
              onClick={() => router.push("/client-add")}
            />
          </div>
        </div>
        <div className="overflow-x-auto -mx-4">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
              <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                {...getTableProps()}
              >
                <thead className="bg-gray-50 dark:bg-gray-700">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          key={column.id}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          <div className="flex items-center space-x-2">
                            {column.render("Header")}
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <Icon icon="heroicons-outline:chevron-down" />
                              ) : (
                                <Icon icon="heroicons-outline:chevron-up" />
                              )
                            ) : null}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
                  {...getTableBodyProps()}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={row.id} className="hover:bg-gray-100 dark:hover:bg-gray-900 transition duration-200">
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            key={cell.column.id}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <button
                    className={`text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 ${!canPreviousPage
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-300 dark:hover:bg-gray-700"
                      } font-medium py-2 px-4 inline-flex items-center justify-center rounded-md transition duration-200`}
                    onClick={previousPage}
                    disabled={!canPreviousPage}
                  >
                    Previous
                  </button>
                  <button
                    className={`text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 ${!canNextPage
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-300 dark:hover:bg-gray-700"
                      } font-medium py-2 px-4 inline-flex items-center justify-center rounded-md transition duration-200`}
                    onClick={nextPage}
                    disabled={!canNextPage}
                  >
                    Next
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Page {pageIndex + 1} of {pageOptions.length}
                  </span>
                  <select
                    className="form-select py-2 px-3 text-sm leading-5 bg-gray-100 text-gray-700 dark:text-gray-300 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Go to page:
                  </span>
                  <input
                    type="number"
                    className="form-input py-2 px-3 text-sm leading-5 bg-gray-100 text-gray-700 dark:text-gray-300 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
                    defaultValue={pageIndex + 1}
                    onChange={(e) => {
                      const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                      gotoPage(pageNumber);
                    }}
                    style={{ width: "50px" }}
                  />
                </div>
              </div>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                  <div className="spinner" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoicePage;
