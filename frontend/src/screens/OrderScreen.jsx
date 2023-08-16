import React, { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Message from "../components/Message";
import Loader from "../components/loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
 
  useDeliverOrderMutation,
  useSendPaymentMutation,
} from "../slices/orderApiSlice";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  // const {
  //   data: paypal,
  //   isLoading: loadingPayPal,
  //   error: errorPayPal,
  // } = useGetPayPalClientIdQuery();
  console.log(order);
   const [doPayment, response] = useSendPaymentMutation();
   console.log('response', response)
  // console.log(paypal);
  const { userInfo } = useSelector((state) => state.auth);

  

  console.log(userInfo);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }
  // TESTING ONLY! REMOVE BEFORE PRODUCTION
  async function onApproveTest() {
    // await payOrder({ orderId, details: { payer: {} } });
    // refetch();

    // toast.success("Order is paid");
    console.log("PAY")
    doPayment()
   
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        console.log(orderID);
        return orderID;
      });
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
    toast.success("Order Delivered");
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message}</Message>
  ) : (
    <>
      <h1>Order Id:{order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item style={{ marginTop: "20px" }}>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item style={{ marginTop: "20px" }}>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>

                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>

                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>

                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>

                {!order.isPaid && (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}

                    {isPending ? (
                      <Loader />
                    ) : (
                      <div>
                        {/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
                        <Button
                          style={{ marginBottom: "10px" }}
                          onClick={onApproveTest}
                        >
                          Test Pay Order
                        </Button>

                        <div>
                          {/* <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                            style={{ layout: "horizontal" }}
                          ></PayPalButtons> */}
                          {/* <stripe-buy-button
                            buy-button-id="'{{BUY_BUTTON_ID}}'"
                            publishable-key="pk_test_51NUsgHSI0j5IRhK1nQHcYoMr1lL8WLkorvRjs104NofTrmPncD7eGe3D6aP1omwJb6PC9w10GPTJdbDeSXnX3IZ700AU4bRO7C"
                          ></stripe-buy-button> */}
                        </div>
                      </div>
                    )}
                  </ListGroup.Item>
                )}
              </ListGroup.Item>

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
