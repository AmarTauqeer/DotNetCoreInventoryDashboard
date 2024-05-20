"use client";
import React, { useState, useEffect, Suspense } from "react";
import { redirect } from "next/navigation";
import DateTimePicker from "react-datetime-picker";
import { useForm } from "react-hook-form";

const SupplierPurchaseDetailReport = () => {
  const url = process.env.NEXT_PUBLIC_URL;
  const [supplierData, setSupplierData] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);
  const [sdate, setSdate] = useState(new Date());
  const [edate, setEdate] = useState(new Date());

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: {
      supplierId: 0,
    },
  });

  const onSubmit = async (data) => {
    const sdateISO = sdate.toISOString();
    const edateISO = edate.toISOString();
    // console.log(data)
    const filterName =supplierData.filter(c=>c.supplierId==data.supplierId);
    const supplierName=filterName[0].name;
    const response = await fetch(
      `${url}/api/purchaseDetail/purchase_details_supplier/${sdateISO}/${edateISO}/${supplierName}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const res = await response.status;

    if (res) {
      window.open(`${url}/api/purchaseDetail/purchase_details_supplier/${sdateISO}/${edateISO}/${supplierName}`);
    } else {
      console.log("There are issue to show the report");
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

  const getSupplier = async (token) => {
    const response = await fetch(`${url}/api/supplier`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    if (res) {
      setSupplierData(res);
    }
  };

  useEffect(() => {
    checkExpiration();
    let user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setAccessToken(user.accessToken);
      getSupplier(user.accessToken);
    } else {
      redirect("/");
    }
  }, []);

  return (
    <>
      {expire && redirect("/")}
      <form className="flex flex-col">
        <div className="container lg:ml-4 md:ml-4 lg:mr-4 md:mr-4">
          <h1 className="font-semibold text-lg flex items-center mt-5 mb-5 md:text-2xl">
            Supplier Wise Purchase Detail
          </h1>

          <div className="flex flex-col lg:flex-row md:flex-row mb-4 mt-10">
            <div className="col lg:row md:row mb-2 lg:mb-0 md:mb-0">
              <div>
                <span className="font-semibold py-2 md:px-0 md:my-0 lg:mr-2 md:mr-2">
                  Start Date
                </span>
                <DateTimePicker onChange={setSdate} value={sdate} />
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row md:flex-row mb-4">
            <div className="col mb-2 lg:mb-0 md:mb-0">
              <span className="font-semibold py-2 md:px-0 md:my-0 md:mr-4 lg:mr-4">
                End Date
              </span>

              <DateTimePicker onChange={setEdate} value={edate} />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row md:flex-row mb-10">
            <div className="col lg:row md:row mb-2 lg:mb-0 md:mb-0">
              <div>
                <span className="font-semibold py-2 md:px-0 md:my-0 lg:mr-2 md:mr-2">
                  Supplier
                </span>
                <select
                  className="py-1 border border-solid border-gray-700 rounded-lg px-2 ml-3 outline-none text-md lg:w-[250px] md:w-[250px]"
                  {...register("supplierId", {
                    required: "Supplier is required.",
                  })}
                >
                  <option value="">Select...</option>
                  {supplierData !== undefined &&
                    supplierData.map((x) => {
                      return (
                        <>
                          <option value={x.supplierId}>{x.name}</option>
                        </>
                      );
                    })}
                </select>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <button
              onClick={handleSubmit(onSubmit)}
              type="button"
              className="rounded-md bg-cyan-600 px-2 py-[7px] text-sm font-semibold 
                text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 
                focus-visible:outline-offset-2 focus-visible:outline-cyan-600 mr-1 w-full lg:w-[340px] md:w-[340px]"
            >
              Print
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default SupplierPurchaseDetailReport;
