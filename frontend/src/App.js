import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/footer";

function App() {
  return (
    <>
      <Header />
      <main>
        <Container>
          <h1>Welcome to E-commerce</h1>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default App;
