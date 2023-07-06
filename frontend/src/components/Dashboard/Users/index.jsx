import React, { useEffect, useState } from "react";
// import { GET_USERS } from "../../../Api/ApiConstant";
// import { getData } from "../../../Api/commonServices";
import  axios  from 'axios';
import loaderZif from "../../../assets/project-idea.gif";

import "./index.css";
const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getRoomDetails = async () => {
      try {
        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/allUsers`,{}).then((response) => {
            setUsers(response.data.users);
          console.log(response.data.users)
        })



        // const { data } = await getData(GET_USERS);
        // setUsers(data.users);
      } catch (err) {
        console.log(err);
      }
    };
    getRoomDetails();
  }, []);
  return (
    <div style={{ padding: "20px" }}>
      <div className="head-content" style={{ marginTop: "-5%" }}>
        <h1>
          All <span style={{ color: "#fe5d5d" }}>USERS</span>
        </h1>
        <img
          src="https://premiumlayers.com/html/hotelbooking/img/nice-title.png"
          alt=""
        />
      </div>
      <div className="user-table">
        <table style={{ width: "100%" }}>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>E-mail</th>
            <th>Role</th>
            <th>Registration date</th>
          </tr>
          {users.length < 1 && (
            <div style={{ width: "400px", margin: "auto" }}>
              <img src={loaderZif} alt="" style={{ maxWidth: "100%" }} />
            </div>
          )}
          {users
            .reverse()
            ?.map(({ username, email, isAdmin, photo, registration, _id }) => (
              <tr key={_id}>
                <td>
                  <div
                    style={{ gap: "10px" }}
                    className="d-flex justify-center align-center"
                  >
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%"
                      }}
                      src={photo}
                      alt=""
                    />
                    <h3>{username}</h3>
                  </div>
                </td>
                <td>{_id.slice(0, 10)}</td>
                <td>{email}</td>
                <td>{isAdmin ? "Admin" : "User"}</td>
                <td>
                  <h3>{new Date(Number(registration)).toLocaleDateString()}</h3>
                </td>
              </tr>
            ))}
        </table>
      </div>
    </div>
  );
};

export default Users;
