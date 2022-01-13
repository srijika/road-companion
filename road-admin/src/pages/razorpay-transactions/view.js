import './table.css'
import React, {useState, useEffect} from "react";
import axios from 'axios'
const baseUrl = process.env.REACT_APP_ApiUrl;

export default function RazorpayView(props) {


    const [paymentDetail, setPaymentDetail] = useState({});
    let razorpay_id = props.match.params.id;    

    useEffect(() => {
        getRazorpayData();
    }, [])


    const getRazorpayData = async () => {

        const res = await axios.post(`${baseUrl}/get/razorpay/transactions/detail`, { razorpay_id: razorpay_id });
        setPaymentDetail(res.data.payment_detail);
        console.log(res.data.payment_detail);
    }


  return (



    <table style={{ width: '100%', padding: '0px 20px' }}>
        <tr>
            <td style={{ fontWeight: 'bold' }}> Order ID :  </td>
            <td style={{ fontWeight: 'bold' }}> {paymentDetail.order_id} </td>
        </tr>
        <tr>
            <td> Razorpay Payment ID   </td>
            <td> {paymentDetail.razorpay_payment_id} </td>
        </tr>
        <tr>
            <td> Razorpay Signature  </td>
            <td> {paymentDetail.razorpay_signature} </td>
        </tr>
        <tr>
            <td> Razorpay Order ID  </td>
            <td> {paymentDetail.razorpay_order_id} </td>
        </tr>

        <tr>
            <td> Entity  </td>
            <td> {paymentDetail.entity} </td>
        </tr>
        <tr>
            <td> Amount   </td>
            <td> {paymentDetail.amount ? paymentDetail.amount.substring(0, paymentDetail.amount.length-2) : ""} </td>
        </tr>
        <tr>
            <td> Currency   </td>
            <td> {paymentDetail.currency} </td>
        </tr>
        <tr>
            <td> Status   </td>
            <td> {paymentDetail.status} </td>
        </tr>
        <tr>
            <td> Invoice ID   </td>
            <td> {paymentDetail.invoice_id} </td>
        </tr>
        <tr>
            <td> Method  </td>
            <td> {paymentDetail.method} </td>
        </tr>
        <tr>
            <td> Description  </td>
            <td> {paymentDetail.description} </td>
        </tr>

        <tr>
            <td> Email  </td>
            <td> {paymentDetail.email} </td>
        </tr>
        <tr>
            <td> Contact  </td>
            <td> {paymentDetail.contact} </td>
        </tr>
        
        <tr>
            <td> Date & Time  </td>
            <td> {paymentDetail.create} </td>
        </tr>
    </table>  
    );
}
