"use client";
import React, { useContext, useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SaleDetail from "@/components/SaleDetail";

const Add = (props) => {
  const router = useRouter();
  const [customerData, setCustomerData] = useState([]);
  const [valueDate, setValueDate] = useState(new Date());
  const [saleItems, setSaleItems] = useState([]);
  const url = process.env.NEXT_PUBLIC_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      createAt: new Date(),
      saleAmount: 0,
      customerId: 0,
    },
  });

  const onSubmit = async (data) => {
    // console.log(data);
    let dateISO = valueDate.toISOString();

    const postData = {
      createAt: valueDate,
      customerId: parseInt(data.customerId),
      saleAmount: parseInt(data.saleAmount),
    };

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(postData),
    };

    const response = await fetch(`${url}/api/saleMaster`, requestOptions);
    const result = await response.json();
    // console.log(result);
    if (result) {
      let id = result.saleMasterId;
      const addSaleDetail = async (id) => {
        if (saleItems.length > 0) {
          for (let index = 0; index < saleItems.length; index++) {
            const element = saleItems[index];
            let data = {
              saleMasterId: id,
              productId: parseInt(element.productId),
              qty: element.qty,
              rate: element.rate,
              amountPerProduct: element.amountPerProduct,
            };
            // console.log(data);

            const response = await fetch(`${url}/api/saleDetail/${id}`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
            const res = await response.json();
            if (res) {
              console.log("sale detail is saved");
            }
          }
        }
      };
      addSaleDetail(id);
    }
    toast.success("Record saved successfully.");
    router.push("/dashboard/sale");
  };

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
    } else {
      redirect("/");
    }
  }, []);

  const detailData = (values) => {
    console.log(values);
    let total = 0;
    let detail = [];
    values.map((x) => {
      let result = {
        saleMasterId: 1,
        productId: x.productId,
        qty: parseInt(x.qty),
        rate: parseInt(x.rate),
        amountPerProduct: x.qty * x.rate,
      };

      let amt = x.qty * x.rate;
      total += amt;
      detail.push(result);
    });

    setValue("saleAmount", total);
    setSaleItems(detail);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-center text-xl font-bold mt-24 mb-3">Sale Invoice</h3>
      <form>
        <div className="flex flex-col m-2">
          <div className="flex items-center m-2 outline-none">
            <span className="w-24 md:w-48 lg:48 text-xs md:text-sm">Date</span>
            <DateTimePicker
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
            <span className="w-24 md:w-48 text-xs md:text-sm">Sale Amount</span>

            <input
              readOnly
              className="w-48 md:w-2/3 ml-2 md:ml-0 border border-solid border-gray-700 rounded py-1 px-1 text-sm text-end font-bold outline-none"
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
            <button
              className="bg-cyan-400 rounded py-1 px-4 hover:bg-cyan-800 hover:text-white cursor-pointer text-sm w-24"
              type="button"
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </button>
          </div>
        </div>
      </form>
      <SaleDetail id={1} detailData={detailData} />
    </div>
  );
};

export default Add;