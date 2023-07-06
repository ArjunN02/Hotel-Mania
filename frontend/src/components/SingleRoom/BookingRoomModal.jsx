import { Alert, Card, Col, Form, Input, Modal, Row, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CHECK_ROOM_AVAILABILITY, CREATE_BOOKING } from '../../Api/ApiConstant'
import { patchData, postData } from '../../Api/commonServices'
import { useBookingContext } from '../../context/BookingContext'
import axios from 'axios'
import useAuth from './../../hooks/useAuth'
import './singleRoom.css'
import swal from 'sweetalert'

import { GrCheckboxSelected } from 'react-icons/gr'
const BookingRoomModal = ({
  isBookingModalVisible,
  setIsBookingModalVisible,
  room,
  hotel,
}) => {
  const [selectedRooms, setSelectedRooms] = useState([])
  const [error, setError] = useState(' Select at least one room')
  const [boo, setBoo] = useState(null)
  const { booking } = useBookingContext()
  const { isLogin } = useAuth()
  const getDateInRange = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const date = new Date(start.getTime())
    let list = []
    while (date <= end) {
      list.push(new Date(date).getTime())
      date.setDate(date.getDate() + 1)
    }
    return list
  }
  const allDates = getDateInRange(
    booking?.arrival._d || new Date(),
    booking?.departure._d || new Date(),
  )
  //console.log(allDates);

  const [isBooked, setIsBooked] = useState([])

  const isAvailable = (roomNumber) => {
    const allDateList = allDates?.map((date) => new Date(date).toDateString())
    const isFound = roomNumber?.unavailableDates?.some((date) => {
      return allDateList.includes(new Date(date).toDateString())
    })
    roomNumber.isTrue = isFound
    setIsBooked(isFound)
    return isFound
  }

  const navigate = useNavigate()
  const handleChange = (roomId, e, isTrue) => {
    const isChecked = selectedRooms.includes(roomId)

    if (!isChecked && !isTrue) {
      e.target.style.border = '3px solid #FE5D5D'
      e.target.style.background = 'rgb(87 159 57)'
    }
    if (isChecked && !isTrue) {
      e.target.style.background = 'rgb(87 159 57)'
      e.target.style.border = ''
    }
    if (!isTrue) {
      setSelectedRooms(
        !isChecked
          ? [...selectedRooms, roomId]
          : selectedRooms?.filter((id) => id !== roomId),
      )
    }
  }
  const handleClick = async () => {
    if (!selectedRooms.length) {
      setError(error)
    } else {
      try {
        await Promise.all(
          selectedRooms?.map((roomId) => {
            const { res } = axios
              .patch(`${process.env.REACT_APP_API_URL}/api/room/availability`, {
                roomId,
                dates: allDates,
              })
              .then((response) => {
                //  console.log(response);
              })
            return res
            // const { res } = patchData(CHECK_ROOM_AVAILABILITY, {
            //   roomId,
            //   dates: allDates
            // });
            // return res;
            // console.log("res", res);
          }),
        )
      } catch (errors) {
        console.log(errors)
      }
      if (!isLogin) {
        navigate('/login')
      }
    }
  }

  const handleDisabled = () => {
    room?.roomNumbers?.map((roomNo) => isAvailable(roomNo))
    setIsBooked(room?.roomNumbers?.map((roomNo) => isAvailable(roomNo)))
  }
  useEffect(() => {
    handleDisabled()
  }, [isBookingModalVisible])

  const { name, phone, address, id } = useAuth()

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const __DEV__ = document.domain === 'localhost'

  async function displayRazorpay(values) {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?')
      return
    }

    const selectRoom = selectedRooms.map((roomId) => {
      const roomsNumber = room?.roomNumbers.find((room) => room._id === roomId)
      return roomsNumber
    })

    const allRoom = selectRoom.map((room) => room.number)
    const amount = room.price * allRoom.length

    const data = await fetch(
      `${
        process.env.REACT_APP_API_URL
      }/api/razorpay?amount=${amount}&currency=${'INR'}`,
      {
        method: 'POST',
      },
    ).then((t) => t.json())

    console.log('data', data)

    const options = {
      key: __DEV__ ? 'rzp_test_6MRZgh5jRieE5u' : 'rzp_test_6MRZgh5jRieE5u',
      currency: data.currency,
      amount: data.amount.toString(),
      order_id: data.id,
      name: 'Payment',
      description: 'Thank you for nothing. Please give us some money',
      image:
        'https://img.freepik.com/premium-vector/hotel-logo-simple-illustration_434503-736.jpg',
      handler: function (response) {
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_signature);
        alert('Payment :' + response.razorpay_order_id + ' successful')

        // dispatch(
        // 	createOrder({
        // 		orderItems: cartItems,
        // 		shippingAddress: "Abc",
        // 		paymentMethod: "RazorPay",
        // 		itemsPrice: data.amount / 100,
        // 		totalPrice: data.amount / 100,
        // 		shippingPrice: data.amount / 100,
        // 		taxPrice: data.amount / 100
        // 	})
        // );
        onFinish(values)
      },
      prefill: {
        name,
        email,
        phoneNumber,
      },
    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }

  const createNewBooking = async (bookingData) => {
    // console.log(bookingData);
    try {
      const data = await axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/booking/addBooking`,
          bookingData,
        )
        .then((response) => {
          console.log('Response', response)
          if (response) {
            swal(
              `Congratulations, ${name.split(' ')[0]}`,
              'You Booking Success!',
              'success',
            )
            setIsBookingModalVisible(false)
            navigate('/dashboard/my-bookings')
          }
        })

      // const { data } = await postData(CREATE_BOOKING, bookingData);
      // if (data) {
      //   swal(
      //     `Congratulations, ${name.split(" ")[0]}`,
      //     "You Booking Success!",
      //     "success"
      //   );
      //   setIsBookingModalVisible(false);
      //   navigate("/dashboard/my-bookings");
      // }
    } catch (error) {
      console.log(error)
    }
  }

  const onFinish = (values) => {
    handleClick()
    //console.log(values);
    console.log('Values', values)
    const selectRoom = selectedRooms.map((roomId) => {
      const roomsNumber = room?.roomNumbers.find((room) => room._id === roomId)
      return roomsNumber
    })

    const allRoom = selectRoom.map((room) => room.number)
    console.log('SELECTED ROOM', allRoom)

    const booking = {
      name: name,
      date: new Date(),
      phone: values.phone,
      address: values.address,
      userId: id,
      hotel: hotel.name,
      hotelAddress: hotel.address,
      city: hotel.city,
      maxPeople: room.maxPeople,
      price: room.price * allRoom.length,
      roomName: room.title,
      roomNumbers: allRoom,
    }
    if (selectedRooms.length > 0) {
      createNewBooking(booking)
    }
  }

  return (
    <div>
      <Modal
        title="Select your rooms:"
        visible={isBookingModalVisible}
        onCancel={() => setIsBookingModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={{
            phone: phone,
            address: address,
          }}
          onFinish={displayRazorpay}
        >
          <Row gutter={[14, 14]}>
            <Col span={12}>
              <h5>King size bed, 1 bathroom,balcony</h5>
              <p>Max People:{room.maxPeople}</p>

              <Form.Item
                name="phone"
                label="Mobile No."
                rules={[{ required: true }]}
              >
                <Input placeholder="Mobile Number" />
              </Form.Item>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true }]}
              >
                <Input.TextArea placeholder="Address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={24}>
                  <Card style={{ marginBottom: '15px' }}>
                    <p className="select">
                      Select Room <GrCheckboxSelected />
                    </p>
                    {room?.roomNumbers?.map((roomNumber) => (
                      <div
                        className="room-number"
                        onClick={(e) =>
                          handleChange(roomNumber._id, e, roomNumber.isTrue)
                        }
                      >
                        <Tooltip
                          title={
                            roomNumber.isTrue ? 'Unavailable' : 'Available'
                          }
                          color={roomNumber.isTrue ? 'red' : 'green'}
                        >
                          <p
                            onClick={() => setBoo(roomNumber)}
                            style={{
                              backgroundColor: roomNumber.isTrue
                                ? '#ddd'
                                : 'rgb(87 159 57)',
                              cursor: roomNumber.isTrue ? 'no-drop' : '',
                            }}
                          >
                            Room No.({roomNumber.number})
                          </p>
                        </Tooltip>

                        <input
                          // disable={ handleDisabled(roomNumber)}
                          type="checkbox"
                          name=""
                          id=""
                        />
                      </div>
                    ))}
                    {!selectedRooms.length && (
                      <Alert type="error" message={error} banner />
                    )}
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
          <button
            className="btn-secondary "
            style={{ width: '100%' }}
            htmlType="submit"
          >
            Reserve Now !
          </button>
        </Form>
      </Modal>
    </div>
  )
}

export default BookingRoomModal
