"use client";
import React, { useState, useEffect, Suspense } from "react";
import DataTable from "react-data-table-component";
import GeneratePDF from "@/components/GeneratePDF";
import CustomStyles from "@/components/CustomStyles";
import Loading from "./loading";
import { redirect} from "next/navigation";
import DateTimePicker from "react-datetime-picker";

const CategoryDetails = () => {
  const url = process.env.NEXT_PUBLIC_URL;
  const [filterCategory, setFilterCategory] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);
  const [sdate, setSdate] = useState(new Date());
  const [edate, setEdate] = useState(new Date());

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
        const event = new Date(row.createAt);
        return event.toDateString();
      },
      sortable: true,
      width: "15%",
    },
  ];

  const handleSubmit = async () => {
    const filtered = categoryData.filter((x) => {
      return new Date(x.createAt) >= sdate && new Date(x.createAt) <= edate;
    });
    if (filtered.length > 0) {
      setFilterCategory(filtered);
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
      <form className="flex flex-col mt-10" onSubmit={handleSubmit}>
        <h1 className="font-semibold text-lg flex items-center mt-5 mb-5 md:text-2xl">
          Category Details
        </h1>
        <div className="flex flex-col lg:flex-row md:flex-row items-center mb-4">
          <div className="col mb-2 lg:mb-0 md:mb-0">
            <div>
              <span className="font-semibold px-2 py-2 md:px-0 md:my-0 lg:mr-2 md:mr-2">
                Start Date
              </span>
              <DateTimePicker onChange={setSdate} value={sdate} />
            </div>
          </div>
          <div className="col mb-2 lg:mb-0 md:mb-0">
            <div>
              <span className="font-semibold px-2 py-2 md:px-0 md:my-0 md:mr-2 lg:mr-2 ml-2">
                End Date
              </span>

              <DateTimePicker onChange={setEdate} value={edate} />
            </div>
          </div>
          <div className="col mb-2 lg:mb-0 md:mb-0 ml-2">
            <div className="flex flex-row items-center justify-between">
              <button
                onClick={handleSubmit}
                type="button"
                className="rounded-md bg-cyan-600 px-2 py-[7px] text-sm font-semibold 
                text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 
                focus-visible:outline-offset-2 focus-visible:outline-cyan-600 w-full mr-1"
              >
                Search
              </button>
              <GeneratePDF data={filterCategory} id="categoryDetails" sdate={new Date(sdate).toDateString()} edate={new Date(edate).toDateString()} />
            </div>
          </div>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {filterCategory.length > 0 ? (
              <div className="border">
                <DataTable
                  columns={columns}
                  data={filterCategory}
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
      </form>
    </>
  );
};

export default CategoryDetails;
