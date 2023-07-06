import { Col, Row } from "antd";
import React from "react";
import mumbai from "../../assets/mumbai.jpg";
import chennai from "../../assets/chennai.jpg";
import bangalore from "../../assets/bangalore.jpg";
import delhi from "../../assets/delhi.jpg";
import './City.css'
import { useNavigate } from "react-router-dom";

const Citys = () => {
  const citys = [
    { id: 1, image: mumbai, name: "Mumbai", properties: 10 },
    { id: 2, image: chennai, name: "Chennai", properties: 90 },
    { id: 3, image: delhi, name: "Delhi", properties: 70 },
    { id: 4, image: bangalore, name: "Bangalore", properties: 10 },
    { id: 5, image: mumbai, name: "Mumbai", properties: 60 },
    { id: 6, image: chennai, name: "Chennai", properties: 70 },
    { id: 7, image: delhi, name: "Delhi", properties: 10 },
    { id: 8, image: bangalore, name: "Bangalore", properties: 20 }
    // { id: 9, image: delhi, name: "Delhi", properties: 20 }
  ];

  const navigate= useNavigate()

  const handleMoveCity=(id,name,city)=>{
    const cityInfo={
      id,name
    }
    navigate("/hoteles",{state:cityInfo});
  }

  return (
    <div
      style={{
        width: "95%",
        margin: "auto",
        marginTop: "30px",
        zIndex: "-5 !important"
      }}
    >
      <div className="head-content">
        <h1>BOOK HOTEL BY CITY </h1>
        <img
          src="https://premiumlayers.com/html/hotelbooking/img/nice-title.png"
          alt=""
        />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. <br /> Atque
          recusandae quidem aspernatua!
        </p>
      </div>
      <Row gutter={[14, 14]}>
        {citys.map(({id, name, image, properties }) => (
          <Col
          key={id}
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 6 }}
          >
            <div className="city-card" onClick={()=>handleMoveCity(id,name)}>
              <div
                style={{
                  backgroundImage: ` linear-gradient(to bottom, rgba(245, 246, 252, 0.52), #00000070),     url(${image})`,
                  height: "200px",
                  width: "100%",
                  backgroundRepeat: "no-repeat",
                  borderRadius: "10px",
                  backgroundPosition: "center",
                  backgroundSize: "cover"
                }}
              ></div>
              <div className="city-content">
                <h2>{name}</h2>
                <h4>{properties} hotels</h4>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Citys;