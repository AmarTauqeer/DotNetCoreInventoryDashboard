"use client";
import React, { useState, useEffect, Suspense } from "react";
import { redirect } from "next/navigation";
import DateTimePicker from "react-datetime-picker";
import { useForm } from "react-hook-form";

const ProductSaleDetailReport = () => {
  const url = process.env.NEXT_PUBLIC_URL;
  const [productData, setProductData] = useState([]);
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
      productId: 0,
    },
  });

  const onSubmit = async (data) => {
    const sdateISO = sdate.toISOString();
    const edateISO = edate.toISOString();
    console.log(data)
    const filterName =productData.filter(c=>c.productId==data.productId);
    const productName=filterName[0].name;
    const response = await fetch(
      `${url}/api/saleDetail/sale_details_product/${sdateISO}/${edateISO}/${productName}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const res = await response.status;

    if (res) {
      window.open(`${url}/api/saleDetail/sale_details_product/${sdateISO}/${edateISO}/${productName}`);
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

  const getProduct = async (token) => {
    const response = await fetch(`${url}/api/product`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    if (res) {
      setProductData(res);
    }
  };

  useEffect(() => {
    checkExpiration();
    let user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setAccessToken(user.accessToken);
      getProduct(user.accessToken);
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
            Product Wise Sale Detail
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
                <span className="font-semibold py-2 mr-4 md:px-0 md:my-0 lg:mr-6 md:mr-6">
                  Product
                </span>
                <select
                  className="py-1 border border-solid border-gray-700 rounded-lg outline-none text-md lg:w-[240px] md:w-[240px]"
                  {...register("productId", {
                    required: "Product is required.",
                  })}
                >
                  <option value="">Select...</option>
                  {productData !== undefined &&
                    productData.map((x) => {
                      return (
                        <>
                          <option value={x.productId}>{x.name}</option>
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
                focus-visible:outline-offset-2 focus-visible:outline-cyan-600 mr-1 w-full lg:w-[325px] md:w-[325px]"
            >
              Print
            </button>
          </div>


        </div>
      </form>
    </>
  );
};

export default ProductSaleDetailReport;
