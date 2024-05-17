'use client'
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

const SaleDetailUpdate = ({ id, data, detailData }) => {
  const [productData, setProductData] = useState([]);
  const [stock, setStock] = useState();
  const [value, setValue] = useState();
  const url = process.env.NEXT_PUBLIC_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);

  const [inputs, setInputs] = useState([
    {
      saleMasterId: id,
      productId: 1,
      qty: 0,
      rate: 0,
      amountPerProduct: 0,
    },
  ]);

  const getStock = async (token) => {
    const response = await fetch(`${url}/api/stock/GetAll`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res);
    if (res) {
      setStock(res);
    }
  };

  const getProduct = async (token) => {
    const response = await fetch(`${url}/api/product`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res);
    if (res) {
      setProductData(res);
      setIsLoading(false);
    }
  };

  const handleChange = (e, index) => {
    const values = [...inputs];
    values[index][e.target.name] = e.target.value;

    //check stock qty
    let filterStock = stock.filter(
      (s) => s.productId === parseInt(inputs[index].productId)
    );
    if (
      parseInt(inputs[index].qty) >
      parseInt(filterStock[0].stockQty)
    ) {
      toast.error(
        "Sale qty doesn't exceed with stock qty=" +
          filterStock[0].stockQty
      );
      return false;
    }

    inputs[index].amountPerProduct = inputs[index].qty * inputs[index].rate;
    setInputs(values);
    detailData(values);
  };
  const handleAdd = () => {
    setInputs([
      ...inputs,
      {
        saleMasterId: id,
        productId: 1,
        qty: 0,
        raate: 0,
        amountPerProduct: 0,
      },
    ]);
    detailData([
      ...inputs,
      {
        saleMasterId: id,
        productId: 1,
        qty: 0,
        rate: 0,
        amountPerProduct: 0,
      },
    ]);
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
      getProduct(user.accessToken);
      setInputs(data);
      getStock(user.accessToken);
    } else {
      redirect("/");
    }
  }, [id, data]);


  return (
    <>
      <div className="grid grid-cols-1 overflow-x-auto m-4">
        <form>
          <div className="flex flex-col items-center justify-center mt-10">
            <div className="flex justify-start items-start text-xl font-bold w-full mb-3">
              Sale Detail
            </div>

            {inputs.length > 0 &&
              inputs.map((i, index) => {
                return (
                  <div className="flex py-1" key={index}>
                    <div>
                      <select
                        name="productId"
                        value={i.productId}
                        className="outline-none ml-1 text-md flex rounded py-[12px] shadow-sm ring-1 ring-inset w-48 md:w-80 lg:w-80
                      ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
                        onChange={(e) => handleChange(e, index)}
                      >
                        <option value="">Select product</option>
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
                    <div>
                      <input
                        name="qty"
                        value={i.qty}
                        placeholder="qty"
                        onChange={(e) => handleChange(e, index)}
                        className="w-[25px] md:w-24 lg:24 ml-1 border border-solid border-gray-700 rounded py-[10px] px-1 text-sm text-center outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        name="rate"
                        value={parseInt(i.rate)}
                        placeholder="rate"
                        onChange={(e) => handleChange(e, index)}
                        className="w-[25px] md:w-24 lg:24 text-end ml-1 border border-solid border-gray-700 rounded py-[10px] px-1 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <input
                        readOnly
                        type="number"
                        name="amountPerProduct"
                        value={parseInt(i.amountPerProduct)}
                        className="w-[45px] md:w-24 lg:24 text-end font-bold ml-1 border border-solid border-gray-700 rounded py-[10px] px-1 text-sm outline-none"
                        onChange={(e) => handleChange(e, index)}
                      />
                    </div>
                    <div>
                      <button
                        className="flex justify-center items-center bg-rose-400 rounded py-[11px] px-4 hover:bg-rose-800 hover:text-white
          cursor-pointer text-sm w-[50px] ml-1"
                        type="button"
                        onClick={() => {
                          const values = [...inputs];
                          values.splice(index, 1);
                          setInputs(values);
                          detailData(values);
                        }}
                      >
                        Del
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          <button
            className="flex justify-center items-center bg-cyan-400 rounded py-[8px] px-4 hover:bg-cyan-800 hover:text-white
            cursor-pointer text-sm w-[120px] ml-1 mt-2"
            type="button"
            onClick={() => handleAdd()}
          >
            Add new row
          </button>
        </form>
      </div>
    </>
  );
};

export default SaleDetailUpdate;