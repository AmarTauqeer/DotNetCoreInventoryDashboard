import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";

const InvoicePDF = (props) => {
    // console.log(props)
  const [customer, setCustomer] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [productData, setProductData] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const data = props.data;
  const detail = props.detail;
  const purchaseDetail = props.purchaseDetail;
  const id = props.id;
  const url = process.env.NEXT_PUBLIC_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);

  

  const makeData = async (token) => {
    let data = await detail;
    let product = await getProduct(token);
    let arr = [];

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      let productName = "";
      for (let index = 0; index < product.length; index++) {
        const elementProduct = product[index];
        if (elementProduct.productId === element.productId) {
          productName = elementProduct.name;
        }
      }
        // console.log(productName);

      let obj = {
        saleMasterId: element.saleMasterId,
        productName: productName,
        qty: element.qty,
        price: element.rate,
        amountPerProduct:element.amountPerProduct
      };
      arr.push(obj);
    }
    setDetailData(arr);
  };

  const makeDataPurchase = async (token) => {
    // console.log('puchase')


    let product = await getProduct(token);
    // console.log(product)

    let data = await purchaseDetail;
    // console.log(data)

    let arr = [];

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      let productName = "";
      for (let index = 0; index < product.length; index++) {
        const elementProduct = product[index];
        // console.log(elementProduct.productId)
        if (elementProduct.productId === element.productId) {
          productName = elementProduct.name;
        }
      }
        // console.log(productName);

      let obj = {
        purchaseMasterId: element.purchaseMasterId,
        productName: productName,
        qty: element.qty,
        price: element.rate,
        amountPerProduct:element.amountPerProduct,
      };
      arr.push(obj);
    }
    setDetailData(arr);
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
  const getCustomer = async (token) => {
    const response = await fetch(`${url}/api/customer`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    if (res) {
      const filtered = res.filter((d) => d.customerId === data.customerId);
      setCustomer(filtered);
    }
  };

  const getSupplier = async (token) => {
    const response = await fetch(`${url}/api/supplier`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    if (res) {
      const filtered = res.filter((d) => d.supplierId === data.supplierId);
      setSupplier(filtered);
    }
  };
  const getProduct = async (token) => {
    // console.log('product')
    const response = await fetch(`${url}/api/product`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res);
    if (res) {
      return res
    }
  };


  useEffect(() => {
    checkExpiration();
    let user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setAccessToken(user.accessToken);
      getCustomer(user.accessToken);
      getSupplier(user.accessToken);
      getProduct(user.accessToken);
      if (id === "purchaseInvoice") {
        makeDataPurchase(user.accessToken);
      } else if (id=="saleInvoice") {
        makeData(user.accessToken);
      }
    } else {
      redirect("/");
    }
  }, [props]);


  const generate = () => {
    // console.log("hi");
    const doc = new jsPDF();
    // console.log(detailData)
    if (detailData.length > 0) {
      if (id === "saleInvoice") {
        const name = customer[0].name;
        const saleAmount = data.saleAmount;
        doc.text("Sale Invoice", 80, 10);
        doc.setFontSize(10);
        doc.text("Customer", 14, 20);
        doc.text(name, 55, 20);
        doc.text("Sale Amount", 14, 30);
        doc.text(saleAmount.toString(), 55, 30);

        doc.autoTable({
          //   styles: { fillColor: [255, 0, 0] },
          margin: { top: 40 },
          head: [["ID", "PRODUCTNAME", "QTY", "PRICE","AMOUNT"]],
          body: detailData.map(({ saleMasterId, productName, qty, price, amountPerProduct }) => {
            return [saleMasterId, productName, qty, price, amountPerProduct];
          }),
        });

        // doc.text("Sale Amount", 120, 250);
        // doc.text(saleAmount, 150, 250);
        doc.save("sale_invoice.pdf");
      } else if (id === "purchaseInvoice") {
        const name = supplier[0].name;
        const purchaseAmount = data.purchaseAmount;
        doc.text("Purchase Invoice", 80, 10);
        doc.setFontSize(10);
        doc.text("Supplier", 14, 20);
        doc.text(name, 55, 20);
        doc.text("Purchase Amount", 14, 30);
        doc.text(purchaseAmount.toString(), 55, 30);

        doc.autoTable({
          //   styles: { fillColor: [255, 0, 0] },
          margin: { top: 40 },
          head: [["ID", "PRODUCTNAME", "QTY", "PRICE", "AMOUNT"]],
          body: detailData.map(({ purchaseMasterId, productName, qty, price,amountPerProduct }) => {
            return [purchaseMasterId, productName, qty, price, amountPerProduct];
          }),
        });

        // doc.text("Sale Amount", 120, 250);
        // doc.text(saleAmount, 150, 250);
        doc.save("purchase_invoice.pdf");
      }
    }
  };
  return <FaFilePdf size={30} color="red" onClick={generate} />;
};

export default InvoicePDF;
