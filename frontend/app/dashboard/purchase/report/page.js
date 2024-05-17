"use client";
import React, { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import DateTimePicker from "react-datetime-picker";

const PurchaseDetailReport = () => {
  const url = process.env.NEXT_PUBLIC_URL;
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);
  const [sdate, setSdate] = useState(new Date());
  const [edate, setEdate] = useState(new Date());

  const handleSubmit = async (accessToken) => {
    // console.log(sdate.toISOString());
    // console.log(edate.toISOString());
    const sdateISO = sdate.toISOString();
    const edateISO = edate.toISOString();
    const response = await fetch(
      `${url}/api/purchaseDetail/purchase_details/${sdateISO}/${edateISO}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const res = await response.status;

    if (res) {
      window.open(`${url}/api/purchaseDetail/purchase_details/${sdateISO}/${edateISO}`);
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

  // selecting datatable rows

  useEffect(() => {
    checkExpiration();
    let user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setAccessToken(user.accessToken);
    } else {
      redirect("/");
    }
  }, []);

  return (
    <>
      {expire && redirect("/")}
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="container lg:ml-4 md:ml-4 lg:mr-4 md:mr-4">       
        <h1 className="font-semibold text-lg flex items-center mt-5 mb-5 md:text-2xl">
          Purchase Detail Report
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
          <div className="mb-4">
              <button
                onClick={handleSubmit}
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

export default PurchaseDetailReport;
