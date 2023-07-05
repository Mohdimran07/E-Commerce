import React, { useEffect } from "react";

import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlices";
import Loader from "../components/loader";
import Message from "../components/Message";

const HomeScreen = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  // const [products, setProducts] = useState();

  useEffect(() => {
    // const fetchProducts = async () => {
    //   const { data } = await axios.get("/api/products");
    //   console.log(data);
    //   setProducts(data);
    // };
    // fetchProducts();
  }, []);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}{" "}
        </Message>
      ) : (
        <>
          <h1>Latest Product</h1>
          <Row>
            {products?.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
