import React, { useEffect, useState } from "react";

const SaleDetailDtl = ({ id, data, detailData }) => {
  const url = process.env.NEXT_PUBLIC_URL;
  const [productData, setProductData] = useState([]);
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
                        disabled
                        name="productId"
                        value={i.productId}
                        className="outline-none ml-1 border border-solid border-gray-700 text-sm flex rounded py-3 shadow-sm ring-1 ring-inset w-48 md:w-80 lg:w-80
                      ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
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
                        disabled
                        name="qty"
                        value={i.qty}
                        placeholder="qty"
                        className="w-[25px] md:w-24 lg:24 ml-1 border border-solid border-gray-700 rounded py-[10px] px-1 text-sm text-center outline-none"
                      />
                    </div>
                    <div>
                      <input
                        disabled
                        type="number"
                        name="rate"
                        value={parseInt(i.rate)}
                        placeholder="rate"
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
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </form>
      </div>
    </>
  );
};

export default SaleDetailDtl;