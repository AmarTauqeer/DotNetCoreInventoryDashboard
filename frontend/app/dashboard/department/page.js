"use client";
import React, { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import DataTable from "react-data-table-component";
import GeneratePDF from "@/components/GeneratePDF";
import CustomStyles from "@/components/CustomStyles";
import Loading from "./loading";
import { redirect, useRouter } from "next/navigation";
import { MdModeEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

const DepartmentList = () => {
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();
  const [filterDepartment, setFilterDepartment] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deleteSelected, setDeleteSelected] = useState(false);

  const handleEdit = (id) => {
    router.push(`/dashboard/department/${id}`);
  };
  const handleAdd = () => {
    router.push(`/dashboard/department/0`);
  };

  const columns = [
    {
      name: "ID#",
      selector: (row) => row.departmentId,
      sortable: true,
      width: "10%",
    },
    {
      name: "NAME",
      selector: (row) => <div className="font-bold">{row.departmentName}</div>,
      sortable: true,
      width: "25%",
    },
    {
      name: "CREATEDATE",
      selector: (row) => {
        const event = new Date(row.createAt)
        return event.toDateString();
      },
      sortable: true,
      width: "30%",
    },
    {
      name: "ACTIONS",
      width:"20%",
      width: "350px",
      selector: (row) => (
        <div className="flex items-center justify-center">
          <div className="d-flex flex-row align-items-center">
            <div>
              <MdModeEdit
                className="m-1 text-yellow-500"
                onClick={() => handleEdit(row.departmentId)}
                size={28}
              />
            </div>
          </div>
          <div className="d-flex flex-row align-items-center">
            <div>
              <MdDeleteForever
                size={28}
                className="m-1 text-red-700"
                onClick={() => handleDelete(row.departmentId)}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleChange = (e) => {
    const filtered = departmentData.filter((x) => {
      return x.departmentName
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    // console.log(filtered)
    setFilterDepartment(filtered);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${url}/api/department/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const status = await response.status;
    // console.log(res);
    if (status == 204) {
      // console.log("The record is deleted successfully");
      getDepartment(accessToken);
      toast.success("Record is deleted successfully.");
    }
  };

  const getDepartment = async (token) => {
    const response = await fetch(`${url}/api/department`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();

    if (res) {
      setDepartmentData(res);
      setIsLoading(false);
    }
  };
  const checkExpiration = () => {
    let tokenTime = new Date(localStorage.getItem("tokenTime"));
    const now = new Date();
    const elapsedTime = new Date(now - tokenTime);
    // console.log(elapsedTime);
    const mint = elapsedTime.getMinutes();
    const seconds = elapsedTime.getSeconds();
    const totalElapsedSeconds = parseInt(mint * 60 + seconds);
    // console.log(totalElapsedSeconds);
    if (totalElapsedSeconds > 3600) {
      localStorage.removeItem("tokenTime");
      localStorage.removeItem("userInfo");
      setExpire(!expire);
    }
  };

  // selecting datatable rows

  const handleChangeRowsChange = (rows) => {
    let idArr = [];
    rows.selectedRows.forEach((element) => {
      idArr.push(element.departmentId);
    });
    // console.log(idArr.length);

    if (idArr.length > 0) {
      setDeleteSelected(true);
    } else {
      setDeleteSelected(false);
    }
    setSelected(idArr);
  };

  const handleDeleteSelected = () => {
    console.log("est");
    for (let i = 0; i < selected.length; i++) {
      const element = selected[i];
      if (element) {
        handleDelete(element);
      }
    }
    setSelected([])
  };

  useEffect(() => {
    checkExpiration();
    let user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setAccessToken(user.accessToken);
      getDepartment(user.accessToken);
    } else {
      redirect("/");
    }
  }, []);

  return (
    <>
      {expire && redirect("/")}
      <div className="flex flex-col items-center justify-center">
        <div className="container">
          <h3 className="font-semibold text-2xl mb-6 mt-6">Department List</h3>
          <div className="flex mb-2 justify-between">
            <div
              className="flex items-center bg-white w-80 md:w-[600px] lg:w-[600px]  
  m-2 md:m-0 lg:m-0"
            >
              <input
                type="text"
                className="lg:py-4 md:py-4 py-1 border rounded-lg px-2 w-full outline-none text-lg"
                placeholder="Search here."
                // value={search}
                onChange={handleChange}
              />
              {/* <span>
                <FiSearch size={30} />
              </span> */}
            </div>
            <div className="flex items-center justify-between">
              <div className="py-4 px-4">
                <span className="text-semibold">
                  <div className="text-green-700">
                    <IoIosAddCircleOutline
                      size={30}
                      onClick={() => handleAdd()}
                    />
                  </div>
                  {/* <h4 onClick={() => handleAdd()}>
                  Add Department
                </h4> */}
                </span>
              </div>
              <div className="py-4">
                <GeneratePDF data={departmentData} id="department" />
              </div>
            </div>
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {selected.length > 0 && (
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleDeleteSelected()}
                >
                  <div className="text-red-700">Delete Selected</div>
                  <div>
                    <MdDeleteForever size={28} className="m-1 text-red-700" />
                  </div>
                </div>
              )}
              {departmentData.length > 0 ? (
                <div className="border">
                  <DataTable
                    columns={columns}
                    data={
                      filterDepartment.length >= 1
                        ? filterDepartment
                        : departmentData
                    }
                    selectableRows
                    onSelectedRowsChange={handleChangeRowsChange}
                    pagination
                    customStyles={CustomStyles}
                    // highlightOnHover
                    dense
                    // fixedHeader={!showModal && fixedHeader}
                    fixedHeaderScrollHeight="400px"
                    theme="solarized"
                    progressPending={isLoading}
                  />
                </div>
              ) : (
                "There are no records to display"
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DepartmentList;
