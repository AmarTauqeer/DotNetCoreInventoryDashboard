"use client";
import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { MdModeEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import Modal from "@/components/Modal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import CustomStyles from "@/components/CustomStyles";
import { CgDetailsMore } from "react-icons/cg";
import Loading from "./loading";
import GeneratePDF from "@/components/GeneratePDF";
import { BiSolidShow } from "react-icons/bi";

const PurchaseMaster = () => {
  const [filterPurchase, setFilterPurchase] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [data, setData] = useState([]);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deleteSelected, setDeleteSelected] = useState(false);

  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();

  const columns = [
    // {
    //   name: "ID",
    //   selector: (row) => row.purchaseMasterId,
    //   sortable: true,
    //   width: "10%",
    // },

    {
      name: "SUPPLIER",
      selector: (row) => {
        if (supplierData !== undefined) {
          const filter = supplierData.filter(
            (x) => x.supplierId === row.supplierId
          );
          if (filter !== undefined && filter.length > 0) {
            return <div className="font-semibold">{filter[0].name}</div>;
          }
          return null;
        }
      },
      sortable: true,
      width: "25%",
    },
    {
      name: "AMOUNT",
      selector: (row) => (
        <div className="font-semibold">€ {row.purchaseAmount}</div>
      ),
      sortable: true,
      width: "20%",
    },
    {
      name: "CREATEDATE",
      selector: (row) => {
        const event = new Date(row.createAt);
        return event.toDateString();
      },
      sortable: true,
      width: "30%",
    },
    {
      name: "ACTIONS",
      width:"20%",
      selector: (row) => (
        <div className="flex items-center justify-center">
          <div className="d-flex flex-row align-items-center">
            <div>
              <BiSolidShow
                className="m-1 text-cyan-500"
                onClick={() =>
                  router.push(`/dashboard/purchase/detail/${row.purchaseMasterId}`)
                }
                size={25}
              />
            </div>

            <div
              className="m-1"
              onClick={() =>
                router.push(`/dashboard/purchase/detail/${row.purchaseMasterId}`)
              }
            ></div>
          </div>
          <div className="d-flex flex-row align-items-center">
            <div>
              <MdModeEdit
                className="m-1 text-yellow-500"
                onClick={() =>
                  router.push(`/dashboard/purchase/${row.purchaseMasterId}`)
                }
                size={22}
              />
            </div>

            <div
              className="m-1"
              onClick={() => router.push(`/dashboard/purchase/${row.purchaseMasterId}`)}
            ></div>
          </div>
          <div className="d-flex flex-row align-items-center">
            <div>
              <MdDeleteForever
                size={22}
                className="m-1 text-rose-700"
                onClick={() => {
                  setData({
                    id: row.purchaseMasterId,
                  });
                  setShowModalDelete(true);
                }}
              />
            </div>
            <div
              className="m-1 bg-red-700"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdropDelete"
              onClick={() => {
                setData({
                  id: row.purchaseMasterId,
                });
              }}
            ></div>
          </div>
        </div>
      ),
      // sortable: true,
      // grow: 2,
      // width: "300px",
    },
  ];

  const callBack = async (childData) => {
    // console.log(childData);
    setPurchaseData(childData);
  };

  const getSupplier = async (token) => {
    const response = await fetch(`${url}/api/supplier`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res);
    if (res) {
      setSupplierData(res);
      setIsLoading(false);
    }
  };

  const getPurchase = async (token) => {
    const response = await fetch(`${url}/api/purchaseMaster`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res);
    if (res) {
      setPurchaseData(res);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    // console.log(e.target.value.toLowerCase());
    if (e.target.value.toLowerCase() === "") {
      setFilterPurchase(purchaseData);
    } else {
      const supplier = supplierData.filter((supp) => {
        return supp.name.toLowerCase().includes(e.target.value.toLowerCase());
      });
      // console.log(supplier);

      if (supplier.length > 0) {
        const filtered = supplierData.filter((x) => {
          return x.supplierId == supplier[0].supplierId;
        });

        if (filtered.length > 0) {
          const filterPurchaseData = purchaseData.filter((x) => {
            return x.supplierId == filtered[0].supplierId;
          });
          setFilterPurchase(filterPurchaseData);
        }
      }
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${url}/api/purchaseMaster/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    // console.log(response.status)
    if ((await response.status) == 204) {
      getPurchase(accessToken);
      toast.success("Record is deleted successfully.");
      setShowModalDelete(false);
    } else {
      toast.error("There are issues to delete the record.");
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

  const handleChangeRowsChange = (rows) => {
    let idArr = [];
    rows.selectedRows.forEach((element) => {
      idArr.push(element.purchaseMasterId);
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
    // console.log("est");
    for (let i = 0; i < selected.length; i++) {
      const element = selected[i];
      if (element) {
        handleDelete(element);
      }
    }
    setSelected([]);
  };

  useEffect(() => {
    checkExpiration();
    let user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setAccessToken(user.accessToken);
      getSupplier(user.accessToken);
      getPurchase(user.accessToken);
    } else {
      redirect("/");
    }
  }, []);

  return (
    <>
      {expire && redirect("/")}
      <div className="flex flex-col items-center justify-center">
        <div className="container">
          <h3 className="font-semibold text-2xl mb-6 mt-6">
            Purchase Invoice List
          </h3>
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
                      onClick={() => router.push("/dashboard/purchase/add")}
                    />
                  </div>
                  {/* <h4 onClick={() => handleAdd()}>
                Add Department
              </h4> */}
                </span>
              </div>
              <div className="py-4">
                <GeneratePDF data={purchaseData} id="purchaseInvoice" />
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
              {supplierData.length > 0 ? (
                <div className="border">
                  <DataTable
                    columns={columns}
                    data={filterPurchase.length >= 1 ? filterPurchase : purchaseData}
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
          <Modal
            title="Sale Invoice Delete"
            isVisible={showModalDelete}
            onClose={() => setShowModalDelete(false)}
          >
            <div className="flex items-center text-xlg p-4">
              <span>Do you realy want to delete this record? </span>
              <button
                onClick={() => handleDelete(data.id)}
                className="py-1 bg-red-600 rounded text-sm text-white px-2 ml-2 mr-2 w-24"
              >
                Delete
              </button>
              <button
                onClick={() => setShowModalDelete(false)}
                className="py-1 bg-cyan-600 rounded text-sm text-white px-2 w-24"
              >
                No
              </button>
            </div>
          </Modal>
        </div>
      </div>
      {/* <div className="flex flex-col items-center justify-center m-2 md:m-0 lg:m-0">
        <h3 className="text-center font-bold text-2xl mb-6 mt-32">
          Sale Invoice List
        </h3>
        <div
          className="flex items-center bg-white border rounded-xl w-80 md:w-[600px] lg:w-[600px]  
        m-2 md:m-0 lg:m-0"
        >
          <input
            type="text"
            className="py-2 rounded-lg px-2 w-full outline-none"
            placeholder="Enter supplier name to search"
            // value={search}
            onChange={handleChange}
          />
          <FiSearch size={30} />
        </div>

        <div className="container m-5">
          <span
            className="flex items-center text-semibold"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          >
            <div className="text-green-700">
              <IoIosAddCircleOutline
                size={30}
                onClick={(e) => router.push("/sale/add")}
              />
            </div>

            <h4 className="ml-2" onClick={() => router.push("/sale/add")}>
              Add
            </h4>
          </span>
        </div>
        <div className="container">
          {saleData.length > 0 ? (
            <DataTable
              columns={columns}
              data={filterSale.length >= 1 ? filterSale : saleData}
              pagination
              customStyles={CustomStyles}
              // highlightOnHover
              dense
              // fixedHeader={!showModal && fixedHeader}
              fixedHeaderScrollHeight="400px"
              theme="solarized"
            />
          ) : (
            "There are no records to display"
          )}
        </div> */}

      {/* <Modal
          title="Purchase Invoice Delete"
          isVisible={showModalDelete}
          onClose={() => setShowModalDelete(false)}
        >
          <div className="flex items-center text-xlg p-4">
            <span>Do you realy want to delete this record? </span>
            <button
              onClick={() => handleDelete(data.saleMasterId)}
              className="py-1 bg-red-600 rounded text-sm text-white px-2 ml-2 mr-2 w-24"
            >
              Delete
            </button>
            <button
              onClick={() => setShowModalDelete(false)}
              className="py-1 bg-cyan-600 rounded text-sm text-white px-2 w-24"
            >
              No
            </button>
          </div>
        </Modal> */}
      {/* </div> */}
    </>
  );
};

export default PurchaseMaster;