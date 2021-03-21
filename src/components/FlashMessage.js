import React, { useState, useEffect } from "react";
import moment from "moment";
import { Alert } from "reactstrap";
import { connect } from "react-redux";
import { ActionsCreator } from "../redux/actions";

const FlashMessage = (props) => {
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState([
    { avatar: "", content: "", time: "", username: "" },
  ]);
  const [length, setLength] = useState(null);
  const [visible, setVisible] = useState(true);
  const onDismiss = () => setVisible(false);

  useEffect(() => {
    props.getNotificationsRedux(JSON.parse(localStorage.getItem("uid")));
    //   .then(() => {
    //     setLength(props.totalNotifications);
    //   });
  }, []); // Only re-run the effect if var changes

  useEffect(() => {
    let timeRN = moment().valueOf().toString();
    let timeCorrection = timeRN - 5555;
    if (
      props.notificationsArray[0] &&
      props.notificationsArray[0].time > timeCorrection
    ) {
      setAlert(true);
    }
    setLength(props.totalNotifications);
    setMessage(props.notificationsArray[0]);
  }, [props.notificationsArray]); // Only re-run the effect if var changes
  if (props.show && alert === true) {
    return (
      <div
        style={{
          position: "fixed",
          zIndex: 500,
          left: "12%",
          top: "90%",
          transform: "translate(-50%, -50%)",
          width: "20%",
          zoom: "80%",
          //   boxShadow: "4px 4px 10px -4px rgba(0,0,0,0.58)",
        }}
      >
        <div className={`notification`}>
          <Alert color="info" isOpen={visible} toggle={onDismiss}>
            <div className="d-flex align-items-center">
              <img className="avatar" width="45" src={message.avatar} alt="" />
              <div className="mx-3">
                <h6 className="mb-0 text-white">
                  {"@"}
                  {message.username} {message.content}
                </h6>
                <small className="text-white">
                  {" "}
                  {moment(Number(message.time)).format("lll")}{" "}
                </small>
              </div>
            </div>
          </Alert>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

const mapStateToProps = (state) => {
  return {
    notificationsArray: state.NotificationsReducer.notificationsArray,
    chatCounter: state.NotificationsReducer.chatCounter,
    totalNotifications: state.NotificationsReducer.totalNotifications,
  };
};
const mapDispatchToProps = (dispatch) => ({
  getNotificationsRedux: (uid) =>
    dispatch(ActionsCreator.getNotificationsRedux(uid)),
});

//export default connect(mapStateToProps, mapDispatchToProps)(App);
export default connect(mapStateToProps, mapDispatchToProps)(FlashMessage);
