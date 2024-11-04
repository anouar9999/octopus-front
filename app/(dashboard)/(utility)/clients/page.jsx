"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination, useRowSelect } from 'react-table';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Dialog } from '@headlessui/react';
import { AlertTriangle, Search, Mail, Eye, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { ChangecompanyID } from '@/components/partials/app/projects/store';
import PageHeader from './PageHeader';

const deleteCompany = async (companyId, setClients) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${companyId}/delete/`);
    if (response.status === 204) {
      setClients((prevClients) => prevClients.filter((client) => client.id !== companyId));
      toast.error('Company deleted successfully', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else {
      console.error('Failed to delete company:', response.data);
    }
  } catch (error) {
    console.error('Error deleting company:', error.message);
  }
};

const useFetchCompanies = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchCompaniesData = async () => {
      if (typeof window !== 'undefined') {
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
          console.error('Error fetching companies data:', error.response ? error.response.data : error.message);
        } finally {
          setIsLoading(false);
          setIsMounted(true);
        }
      }
    };

    fetchCompaniesData();
  }, []);

  return { clients, setClients, isLoading, isMounted };
};

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, companyName }) => (
  <Dialog open={isOpen} onClose={onClose} className="relative z-50">
    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3 text-amber-500 mb-4">
          <AlertTriangle className="h-6 w-6" />
          <Dialog.Title className="text-lg font-medium">Delete Company</Dialog.Title>
        </div>
        <Dialog.Description className="text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-semibold">{companyName}</span>? This action cannot be undone.
        </Dialog.Description>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
);

const ActionButton = ({ action, onClick }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-all duration-200 ${
      action.color === 'blue' ? 'text-blue-600 hover:bg-blue-50' :
      action.color === 'green' ? 'text-green-600 hover:bg-green-50' :
      'text-red-600 hover:bg-red-50'
    }`}
  >
    {action.icon === 'heroicons-outline:envelope-open' && <Mail className="h-5 w-5" />}
    {action.icon === 'heroicons-outline:eye' && <Eye className="h-5 w-5" />}
    {action.icon === 'heroicons:pencil-square' && <Pencil className="h-5 w-5" />}
    {action.icon === 'heroicons-outline:trash' && <Trash2 className="h-5 w-5" />}
  </button>
);

const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (name) => {
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-pink-500',
  ];
  
  // Use name string to consistently pick a color
  const index = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) ?? 0;
  return colors[index % colors.length];
};

const ClientAvatar = ({ src, name, size = 10, className = '' }) => {
  const initials = getInitials(name);
  const bgColor = getRandomColor(name);

  return (
    <div
      className={`
        inline-flex items-center justify-center
        ${`w-${size} h-${size}`}
        rounded-full
        ${bgColor}
        text-white font-medium
        ring-2 ring-white shadow-sm
        transition-transform duration-200 ease-in-out
        hover:scale-105
        ${className}
      `}
      title={name}
    >
      <span className={`text-${size < 8 ? 'xs' : 'sm'}`}>
        {src && (
          <div
            className={`w-${size} h-${size} rounded-full overflow-hidden ring-2 ring-white`}
          >
            <img src={src} alt={name} className="w-full h-full object-cover" />
          </div>
        )}
        {src == null && initials}
      </span>
    </div>
  );
};

const InvoicePage = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const { clients, setClients, isLoading, isMounted } = useFetchCompanies();

  const handleDeleteClick = useCallback((company) => {
    setSelectedCompany(company);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (selectedCompany) {
      deleteCompany(selectedCompany.id, setClients);
      setDeleteDialogOpen(false);
      setSelectedCompany(null);
    }
  }, [selectedCompany]);

  const actions = useMemo(
    () => [
      {
        name: 'portal',
        icon: 'heroicons-outline:envelope-open',
        color: 'blue',
        doit: (id) => {
          router.push(`/admin-portal/${id}`);
          dispatch(ChangecompanyID(id));
        },
      },
      {
        name: 'View',
        icon: 'heroicons-outline:eye',
        color: 'blue',
        doit: (id) => router.push(`/profile/${id}`),
      },
      {
        name: 'edit',
        icon: 'heroicons:pencil-square',
        color: 'green',
        doit: (id) => router.push(`/client-edit/${id}`),
      },
      {
        name: 'delete',
        icon: 'heroicons-outline:trash',
        color: 'danger',
        doit: (company) => handleDeleteClick(company),
      },
    ],
    [router, handleDeleteClick]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Company',
        accessor: 'CompanyName',
        Cell: ({ row: { original } }) => (
          <div className="flex items-center gap-3">
            <ClientAvatar src={original.CompanyImage} name={original.CompanyName} />
            <div>
              <div className="font-medium text-gray-900">{original.CompanyName}</div>
              <div className="text-sm text-gray-500">{original.CompanyEmail}</div>
            </div>
          </div>
        ),
      },
      {
        Header: 'Address',
        accessor: 'CompanyAddress',
        Cell: ({ value }) => (
          <div className="max-w-xs truncate text-gray-600">{value}</div>
        ),
      },
      {
        Header: 'Phone',
        accessor: 'CompanyPhoneNumber',
        Cell: ({ value }) => (
          <div className="text-gray-600">{value}</div>
        ),
      },
      {
        Header: 'Team Members',
        accessor: 'members',
        Cell: ({ value }) => (
          <div className="flex -space-x-2">
            {value.slice(0, 3).map((member, index) => (
              <ClientAvatar
                key={index}
                src={member.MemberImage}
                name={member.MemberFullName}
                size={8}
              />
            ))}
            {value.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center">
                <span className="text-xs text-gray-600">+{value.length - 3}</span>
              </div>
            )}
          </div>
        ),
      },
      {
        Header: 'Actions',
        accessor: 'id',
        Cell: ({ row: { original } }) => (
          <div className="flex items-center gap-1">
            {actions.map((action, index) => (
              <ActionButton
                key={index}
                action={action}
                onClick={() => action.doit(original.id)}
              />
            ))}
          </div>
        ),
      },
    ],
    [actions]
  );

  const tableInstance = useTable(
    {
      columns,
      data: clients,
      initialState: { pageSize: 10 },
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
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex } = state;

  if (!isMounted) return null;

  return (
    <>
      <PageHeader
        title="Client Companies"
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onAddClick={() => router.push('/client-add')}
        totalClients={clients.length}
      />
      <div className="px-6  max-w-[1400px] mx-auto">
        <ToastContainer />
        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          companyName={selectedCompany?.CompanyName}
        />

        <div className="w-full">
          <div className="overflow-x-auto">
            <table
              {...getTableProps()}
              className="w-full border-separate border-spacing-y-2"
            >
              {/* Table Header */}
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        key={column.id}
                        className="sticky top-0 bg-gray-800 first:rounded-tl-xl  last:rounded-tr-xl"
                      >
                        <div className="px-6 py-5 text-left">
                          <div className="flex items-center gap-2 text-gray-100">
                            <span className="text-xs font-semibold uppercase tracking-wider">
                              {column.render('Header')}
                            </span>
                            <span className="text-gray-400">
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                ) : (
                                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                )
                              ) : null}
                            </span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              {/* Table Body */}
              <tbody {...getTableBodyProps()}>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="h-[400px] text-center bg-white"
                    >
                      <div className="flex flex-col items-center justify-center h-full gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <p className="text-sm text-gray-500 font-medium">
                          Loading data...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : page.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="h-[400px] text-center bg-white"
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="bg-gray-50 rounded-full p-3 mb-3">
                          <svg
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium mb-1">
                          No data found
                        </p>
                        <p className="text-sm text-gray-400">
                          Try adjusting your filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  page.map((row, rowIndex) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        key={row.id}
                        className={`
                    bg-white
                    
                  `}
                      >
                        {row.cells.map((cell, cellIndex) => (
                          <td
                            {...cell.getCellProps()}
                            key={cell.column.id}
                            className={`
                        relative px-6 py-4 text-sm
                        group-hover:bg-blue-50/50
                  
                      `}
                          >
                            {/* Vertical line separator */}
                            {cellIndex > 0 && (
                              <div className="absolute left-0 top-2 bottom-2 w-px bg-gray-100 group-hover:bg-transparent" />
                            )}
                            <div className="relative">
                              {cell.render('Cell')}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="mt-4 px-6 py-4 bg-white border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Page Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => tableInstance.gotoPage(0)}
                  disabled={!canPreviousPage}
                  className={`p-2 rounded-lg transition-all ${
                    !canPreviousPage
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                  className={`p-2 rounded-lg transition-all ${
                    !canPreviousPage
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: pageOptions.length }, (_, i) => i + 1)
                    .slice(
                      Math.max(0, pageIndex - 1),
                      Math.min(pageOptions.length, pageIndex + 4)
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => tableInstance.gotoPage(page - 1)}
                        className={`
                    min-w-[2.5rem] h-10 rounded-lg text-sm font-medium transition-all
                    ${
                      pageIndex + 1 === page
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-500 hover:bg-gray-100'
                    }
                  `}
                      >
                        {page}
                      </button>
                    ))}
                </div>

                <button
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                  className={`p-2 rounded-lg transition-all ${
                    !canNextPage
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => tableInstance.gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                  className={`p-2 rounded-lg transition-all ${
                    !canNextPage
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Page Size and Info */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <select
                    value={tableInstance.state.pageSize}
                    onChange={(e) => {
                      tableInstance.setPageSize(Number(e.target.value));
                    }}
                    className="pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize} rows
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-500">per page</span>
                </div>

                <span className="text-sm text-gray-500">
                  Page {pageIndex + 1} of {pageOptions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicePage;