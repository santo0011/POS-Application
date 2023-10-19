import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/layout/Layout";
import "./bill.scss";
import { BiShowAlt, BiPrinter } from "react-icons/bi";
import { HiDocumentDownload } from "react-icons/hi";
import { MdClear } from "react-icons/md";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_all_invoice } from "../store/Reducers/invoiceReducer";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { client } from "../api/api";
import { useReactToPrint } from "react-to-print";
import moment from 'moment';

const Bill = () => {
  const dispatch = useDispatch();

  const { allInvoice, invoiceCount } = useSelector((state) => state.invoice);

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [parPage, setParPage] = useState(6);

  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [totalQty, setTotalQty] = useState();

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_all_invoice(obj));
  }, [searchValue, currentPage, parPage]);


  // genarateBill
  const genarateBill = (k) => {
    setOpen(true);
    setData(k);
    setTotalAmount(k.totilePrice);
    setTotalQty(k.totalProduct);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let sum = 0;

  for (let i = 0; i < data?.products.length; i++) {
    sum += data?.products[i].price * data?.products[i].qty;
  }

  // console.log(data?.products[0].price)

  return (
    <Layout>
      <div className="m-3">
        <div className="container-fluid">
          <div
            className="d-flex align-items-center py-2 px-4"
            style={{ backgroundColor: "#fff", justifyContent: "space-between" }}
          >
            <h5 className="">Total invoice ({invoiceCount && invoiceCount})</h5>
            <input
              className="productSearch"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="text"
              placeholder="Search"
            />

            <div></div>
          </div>

          {
            allInvoice.length > 0 ? <div>

              <div style={{ backgroundColor: "#fff" }} className="mt-4">
                <table class="table border" style={{ textAlign: "center" }}>
                  <thead>
                    <tr className="invoiceTr">
                      <th className="invoiceHead" scope="col">
                        ID
                      </th>
                      <th className="invoiceHead" scope="col">
                        Customer Name
                      </th>
                      <th className="invoiceHead" scope="col">
                        Contact No
                      </th>
                      <th className="invoiceHead" scope="col">
                        Qty
                      </th>
                      <th className="invoiceHead" scope="col">
                        Total Amount
                      </th>
                      <th className="invoiceHead" scope="col">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allInvoice &&
                      allInvoice?.map((k, i) => (
                        <tr>
                          <th scope="row" className="invoiceList">
                            {k._id}
                          </th>
                          <th className="invoiceList">{k.customerName}</th>
                          <th className="invoiceList">{k.mobileNum}</th>
                          <th className="invoiceList">{k.totalProduct}</th>
                          <th className="invoiceList">₹ {k.totilePrice}</th>
                          <th className="invoiceList">
                            <span onClick={() => genarateBill(k)}>
                              <BiShowAlt style={{ fontSize: "22px" }} />
                            </span>
                          </th>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {invoiceCount >= parPage ? (
                <Pagination
                  pageNumber={currentPage}
                  setPageNumber={setCurrentPage}
                  totalItem={invoiceCount}
                  parPage={parPage}
                  showItem={Math.floor(invoiceCount / parPage)}
                />
              ) : (
                ""
              )}

            </div> : <h4 style={{ textAlign: "center", paddingTop: "60px" }}> Your invoice is empty !</h4>
          }

        </div>

      </div>

      <Dialog open={open} onClose={handleClose}>
        <div className="billContainer">
          <div className="billWrapper" ref={componentRef}>
            <div className="billHeader">
              <img src={`${client}/logo512.png`} alt="" />
              <h6>Shanto Shop</h6>
              <p>Contact : 75840498912 | Nahata, Gopalnagar</p>
            </div>

            <hr className="hrStyle" />

            <div className="billContact">
              <p>
                Customer Name : <span>{data?.customerName}</span>
              </p>
              <p>
                Phone No : <span>{data?.mobileNum}</span>
              </p>
              <p>
                Date : <span>{moment(data?.date, "MMMM D, YYYY h:mm A").format("D MMMM, YYYY h:mm A")}</span>
              </p>
            </div>

            <hr className="hrStyle" />

            <div className="billTable">
              <table class="table border" style={{ textAlign: "center" }}>
                <thead>
                  <tr className="billHead">
                    <th scope="col">Sl</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {data &&
                    data?.products?.map((d, i) => {
                      return (
                        <>
                          <tr className="billBody">
                            <th>{i + 1}</th>
                            <th>{d.product}</th>
                            <th>₹ {d.price}</th>
                            <th>{d.qty}</th>
                            <th>₹ {d.qty * d.price}</th>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </table>

              <div className="priceCalculateStyle">
                <p>
                  Sub Total : <span> ₹ {sum}</span>
                </p>
                <p>
                  Discount ({((sum - totalAmount) / sum * 100).toFixed(2)}%) : <span> - ₹ {sum - totalAmount}</span>
                </p>
                <hr className="hrStyle2" />
                <p>
                  Total <span style={{ fontSize: "9px" }}>({totalQty} items)</span> : <span> ₹ {totalAmount}</span>
                </p>
              </div>

              <p style={{ fontSize: "8px", marginTop: "10px" }}>
                NOTE : This is computer generated receipt and does not require
                physical signature.
              </p>
            </div>
          </div>

          <div className="printBtn">
            {/* <AiOutlinePrinter /> */}

            <button onClick={handlePrint}>
              <BiPrinter style={{ fontSize: "20px", fontWeight: "bold" }} />
            </button>
            {/* <button style={{ background: "red" }}>
              <HiDocumentDownload
                style={{ fontSize: "20px", fontWeight: "bold", color: "#fff" }}
              />
            </button> */}
          </div>
        </div>
      </Dialog>

    </Layout>
  );
};



export default Bill;