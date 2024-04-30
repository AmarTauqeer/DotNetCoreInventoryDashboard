'use client'
import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SaleDetailUpdate from "@/components/SaleDetailUpdate";
import { useParams, useRouter } from "next/navigation";
// import InvoicePDF from "@/components/InvoicePDF";
import SaleDetailDtl from "@/components/SaleDetailDtl";

const Detail = (props) => {
  const params = useParams();
  let id = "";
  if (params) {
    // console.log(params.id);
    id = params.id;
  }
  const router = useRouter();
  const [customerData, setCustomerData] = useState([]);
  const [valueDate, setValueDate] = useState(new Date());
  const [saleItems, setSaleItems] = useState([]);
  const [saleData, setSaleData] = useState([]);
  const [saleDetailData, setSaleDetailData] = useState([]);
  const url = process.env.NEXT_PUBLIC_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);
  const {
    register,
    formState: { errors },
    // handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      createAt: new Date(),
      saleAmount: 0,
      customerId: 0,
    },
  });

  const getCustomer = async (token) => {
    const response = await fetch(`${url}/api/customer`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res);
    if (res) {
      setCustomerData(res);
      setIsLoading(false);
    }
  };

  const getSale = async (token) => {
    const response = await fetch(`${url}/api/saleMaster`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res);
    if (res) {
      let filterSale = res.filter((r) => r.saleMasterId == id);
      filterSale = filterSale[0];
      // console.log(filterSale);
      setSaleData(filterSale);
      setValue("customerId", filterSale.customerId);
      setValue("createAt", filterSale.createAt);
      setValue("saleAmount", filterSale.saleAmount);
    }
  };

  const getSaleDetail = async (token) => {
    const response = await fetch(`${url}/api/saleDetail`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res);
    let filterSale = [];
    if (res) {
      filterSale = res.filter((r) => r.saleMasterId == parseInt(id));
    }
    // console.log(filterSale);
    setSaleDetailData(filterSale);
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

  useEffect(() => {
    checkExpiration();
    let user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setAccessToken(user.accessToken);
      getCustomer(user.accessToken);
      getSale(user.accessToken);
      getSaleDetail(user.accessToken);
    } else {
      redirect("/");
    }
  }, []);

  const detailData = (values) => {
    // console.log(values);
    let total = 0;
    let detail = [];
    values.map((x) => {
      // console.log("hi");
      let result = {
        saleMasterId: id,
        productId: x.productId,
        qty: parseInt(x.qty),
        rate: parseInt(x.rate),
        amountPerProduct: x.qty * x.rate,
      };
      // console.log(result)

      let amt = x.qty * x.rate;
      total += amt;
      // console.log(total);
      detail.push(result);
    });

    setValue("saleAmount", total);
    // console.log(detail);
    setSaleItems(detail);
  };
  // console.log(purchaseItems);
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-center text-xl font-bold mt-24 mb-3">
          Sale Invoice
        </h3>
        <form>
          <div className="flex flex-col m-2">
            <div className="flex items-center m-2 outline-none">
              <span className="w-24 md:w-48 lg:48 text-xs md:text-sm">
                Date
              </span>
              <DateTimePicker
                disabled
                placeholder="Enter create date."
                onChange={setValueDate}
                value={valueDate}
                name="createAt"
                className="py-0 md:py-1 ml-2 md:ml-0 text-xs md:text-sm w-24 md:w-2/3 lg:w-2/3"
              />
            </div>

            <div className="flex items-center m-2">
              <span className="w-24 md:w-48 text-xs md:text-sm">Customer</span>
              <select
                disabled
                className="outline-none ml-2 md:ml-0 text-xs md:text-sm flex rounded md:py-1 py-2 shadow-sm ring-1 ring-inset w-48 md:w-2/3 lg:w-2/3 
                    ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
                {...register("customerId", {
                  required: "Customer is required.",
                })}
              >
                <option value="">Select...</option>
                {customerData !== undefined &&
                  customerData.map((x) => {
                    return (
                      <>
                        <option value={x.customerId}>{x.name}</option>
                      </>
                    );
                  })}
              </select>
            </div>
            <div className="flex items-center m-2">
              <span className="w-24 md:w-48 text-xs md:text-sm">
                Sale Amount
              </span>

              <input
                readOnly
                className="w-48 md:w-2/3 ml-2 md:ml-0 border border-solid border-gray-700 rounded py-1 px-1 
                text-sm text-end font-bold outline-none"
                {...register("saleAmount", {})}
              />
            </div>
            <div className="flex justify-center items-center m-2 mt-8">
              <button
                type="button"
                className="bg-slate-300 rounded py-1 px-3 mr-1 hover:bg-slate-800 hover:text-white cursor-pointer text-sm w-24"
                onClick={() => router.push("/dashboard/sale")}
              >
                Close
              </button>
              <div className="flex mb-2">
                {/* {saleDetailData.length > 0 && (
                  <InvoicePDF
                    data={saleData}
                    id="saleInvoice"
                    detail={saleDetailData}
                  />
                )} */}
              </div>
            </div>
          </div>
        </form>
        {/* {console.log(purchaseDetailData)} */}
        <SaleDetailDtl id={id} detailData={detailData} data={saleDetailData} />
      </div>
    </>
  );
};

export default Detail;