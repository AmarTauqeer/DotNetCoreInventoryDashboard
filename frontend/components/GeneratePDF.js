import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";

const GeneratePDF = (props) => {
  const data = props.data;
  const id = props.id;
  // console.log(data);

  const generate = () => {
    // console.log("hi");
    const doc = new jsPDF();
    if (data.length > 0) {
      if (id === "stock") {
        doc.text("Inventory Stock List", 14, 10);
        doc.autoTable({
          head: [["PRODUCTID", "PRODUCTNAME", "STOCKQTY"]],
          body: data.map(({ product_id, product_name, stock_qty }) => {
            return [product_id, product_name, stock_qty];
          }),
        });
        doc.save("stock.pdf");
      } else if (id === "supplier") {
        doc.text("Supplier List", 14, 10);
        doc.autoTable({
          head: [["NAME", "EMAIL", "PHONE", "ADDRESS", "CITY", "COUNTRY"]],
          body: data.map(({ name, email, phone, address, city, country }) => {
            return [name, email, phone, address, city, country];
          }),
        });
        doc.save("list_of_supplier.pdf");
      } else if (id === "customer") {
        doc.text("Customer List", 14, 10);
        doc.autoTable({
          head: [["NAME", "EMAIL", "PHONE", "ADDRESS", "CITY", "COUNTRY"]],
          body: data.map(({ name, email, phone, address, city, country }) => {
            return [name, email, phone, address, city, country];
          }),
        });
        doc.save("list_of_customer.pdf");
      } else if (id === "category") {
        doc.text("Category List", 14, 10);
        doc.autoTable({
          head: [["ID", "NAME", "DESCRIPTION"]],
          body: data.map(({ id, name, description }) => {
            return [id, name, description];
          }),
        });
        doc.save("list_of_category.pdf");
      }else if (id === "department") {
        doc.text("Department List", 14, 10);
        doc.autoTable({
          head: [["ID", "NAME","Create DATE"]],
          body: data.map(({ departmentId, departmentName, createAt }) => {
            return [departmentId, departmentName,createAt];
          }),
        });
        doc.save("list_of_department.pdf");
      } else if (id === "employee") {
        doc.text("Employee List", 14, 10);
        doc.autoTable({
          head: [["ID", "NAME","DEPARTMENT","EMAIL","ADDRESS","CITY","COUNTRY"]],
          body: data.map(({ employeeId, employeeName, departmentId, email, address, city, country }) => {
            return [employeeId, employeeName, departmentId, email, address, city, country];
          }),
        });
        doc.save("list_of_employee.pdf");
      } 
      else if (id === "product") {
        doc.text("Product List", 14, 10);
        doc.autoTable({
          head: [
            [
              "ID",
              "NAME",
              "DESCRIPTION",
              "CATEGORY",
              "PURCHASERATE",
              "SALERATE",
            ],
          ],
          body: data.map(
            ({ id, name, description, category, purchase_rate, sale_rate }) => {
              return [
                id,
                name,
                description,
                category,
                purchase_rate,
                sale_rate,
              ];
            }
          ),
        });
        doc.save("list_of_product.pdf");
      }
    }
  };
  return <FaFilePdf size={30} color="red" onClick={generate} />;
};

export default GeneratePDF;