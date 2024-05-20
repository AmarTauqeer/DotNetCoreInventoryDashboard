'use client'
import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import PurchaseDetailUpdate from "@/components/PurchaseDetailUpdate";
import { useParams, useRouter } from "next/navigation";
import InvoicePDF from "@/components/InvoicePDF";
import PurchaseDetailDtl from "@/components/PurchaseDetailDtl";

const Detail = (props) => {
  const params = useParams();
  let id = "";
  if (params) {
    // console.log(params.id);
    id = params.id;
  }
  const router = useRouter();
  const [supplierData, setSupplierData] = useState([]);
  const [valueDate, setValueDate] = useState(new Date());
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [purchaseDetailData, setPurchaseDetailData] = useState([]);
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
      purchaseAmount: 0,
      supplierId: 0,
    },
  });

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
      let filterPurchase = res.filter((r) => r.purchaseMasterId == id);
      filterPurchase = filterPurchase[0];
      console.log(filterPurchase);
      setPurchaseData(filterPurchase);
      setValue("supplierId", filterPurchase.supplierId);
      setValue("createAt", filterPurchase.createAt);
      setValue("purchaseAmount", filterPurchase.purchaseAmount);
    }
  };

  const getPurchaseDetail = async (token) => {
    const response = await fetch(`${url}/api/purchaseDetail`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res);
    let filterPurchase = [];
    if (res) {
      filterPurchase = res.filter((r) => r.purchaseMasterId == parseInt(id));
    }
    // console.log(filterSale);
    setPurchaseDetailData(filterPurchase);
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
      getSupplier(user.accessToken);
      getPurchase(user.accessToken);
      getPurchaseDetail(user.accessToken);
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
        purchaseMasterId: id,
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

    setValue("purchaseAmount", total);
    // console.log(detail);
    setPurchaseItems(detail);
  };
  // console.log(purchaseItems);
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-center text-xl font-bold mt-24 mb-3">
          Purchase Invoice
        </h3>
        <form>
          <div className="flex flex-col m-2">
            <div className="flex items-center m-2 outline-none">
              <span className="w-24 md:w-48 lg:48 text-xs md:text-sm md:font-semibold">
                Date
              </span>
              <DateTimePicker
                disabled
                placeholder="Enter create date."
                onChange={setValueDate}
                value={valueDate}
                name="createAt"
                className="w-full outline-none text-md"
              />
            </div>

            <div className="flex items-center m-2">
              <span className="w-24 md:w-48 text-xs md:text-sm md:font-semibold">Supplier</span>
              <select
                disabled
                className="py-3 border border-solid border-gray-700 rounded-lg px-2 w-full outline-none text-md"
                {...register("supplierId", {
                  required: "Supplier field is required.",
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
            <div className="flex items-center m-2">
              <span className="w-24 md:w-48 text-xs md:text-sm md:font-semibold">
                Purchase Amount
              </span>

              <input
                readOnly
                className="py-3 border border-solid border-gray-700 rounded-lg px-2 w-full outline-none text-md text-end"
                {...register("purchaseAmount", {})}
              />
            </div>
            <div className="flex justify-center items-center m-2 mt-8">
              <button
                type="button"
                className="bg-slate-300 rounded py-2 px-3 mr-1 hover:bg-slate-800 hover:text-white cursor-pointer text-sm w-24"
                onClick={() => router.push("/dashboard/purchase")}
              >
                Close
              </button>
              <div className="flex mb-2">
                {purchaseDetailData.length > 0 && (
                  <InvoicePDF
                    data={purchaseData}
                    id="purchaseInvoice"
                    purchaseDetail={purchaseDetailData}
                  />
                )}
              </div>
            </div>
          </div>
        </form>
        {/* {console.log(purchaseDetailData)} */}
        <PurchaseDetailDtl id={id} detailData={detailData} data={purchaseDetailData} />
      </div>
    </>
  );
};

export default Detail;