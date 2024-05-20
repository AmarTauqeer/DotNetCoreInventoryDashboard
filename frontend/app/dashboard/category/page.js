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
import { FaFilePdf } from "react-icons/fa";

const CategoryList = () => {
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();
  const [filterCategory, setFilterCategory] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deleteSelected, setDeleteSelected] = useState(false);

  const handleEdit = (id) => {
    router.push(`/dashboard/category/${id}`);
  };
  const handleAdd = () => {
    router.push(`/dashboard/category/0`);
  };

  const columns = [
    {
      name: "ID#",
      selector: (row) => row.categoryId,
      sortable: true,
      width: "10%",
    },
    {
      name: "NAME",
      selector: (row) => <div className="font-bold">{row.name}</div>,
      sortable: true,
      width: "20%",
    },
    {
      name: "CREATEDATE",
      selector: (row) => {
        const event = new Date(row.createAt)
        return event.toDateString();
      },
      sortable: true,
      width: "20%",
    },
    {
      name: "ACTIONS",
      // width: "50%px",
      selector: (row) => (
        <div className="flex items-center justify-center">
          <div className="d-flex flex-row align-items-center cursor-pointer">
            <div>
              <MdModeEdit
                className="m-1 text-yellow-500"
                onClick={() => handleEdit(row.categoryId)}
                size={22}
              />
            </div>
          </div>
          <div className="d-flex flex-row align-items-center cursor-pointer">
            <div>
              <MdDeleteForever
                size={22}
                className="m-1 text-red-700"
                onClick={() => handleDelete(row.categoryId)}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handlePrint = async (accessToken) => {
    const response = await fetch(`${url}/api/category/list_of_category`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const res = await response
    // window.open(res.json())
    // console.log(res)

    if (res) {
      window.open(`${url}/api/category/list_of_category`)
      // console.log("list of product print hit")
    }
  };

  const handleChange = (e) => {
    const filtered = categoryData.filter((x) => {
      return x.name
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    // console.log(filtered)
    setFilterCategory(filtered);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${url}/api/category/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const status = await response.status;
    // console.log(res);
    if (status == 204) {
      // console.log("The record is deleted successfully");
      getCategory(accessToken);
      toast.success("Record is deleted successfully.");
    }
  };

  const getCategory = async (token) => {
    const response = await fetch(`${url}/api/category`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();

    if (res) {
      setCategoryData(res);
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
      idArr.push(element.categoryId);
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
      getCategory(user.accessToken);
    } else {
      redirect("/");
    }
  }, []);

  return (
    <>
      {expire && redirect("/")}
      <div className="flex flex-col items-center justify-center">
        <div className="container">
          <h3 className="font-semibold text-2xl mb-6 mt-6">Category List</h3>
          <div className="flex mb-2 justify-between">
            <div
              className="flex items-center bg-white w-80 md:w-[600px] lg:w-[600px]  
  m-2 md:m-0 lg:m-0"
            >
              <input
                type="text"
                className="lg:py-2 md:py-2 py-1 border rounded-lg px-2 w-full outline-none text-md"
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
                  <div className="text-green-700 cursor-pointer">
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
              <div className="cursor-pointer">
                <FaFilePdf size={30} onClick={() => handlePrint(accessToken)} />
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
              {categoryData.length > 0 ? (
                <div className="border">
                  <DataTable
                    columns={columns}
                    data={
                      filterCategory.length >= 1
                        ? filterCategory
                        : categoryData
                    }
                    selectableRows
                    onSelectedRowsChange={handleChangeRowsChange}
                    pagination
                    customStyles={CustomStyles}
                    dense
                    fixedHeaderScrollHeight="400px"
                    theme="solarized"
                    progressPending={isLoading}
                    responsive={true}
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

export default CategoryList;
