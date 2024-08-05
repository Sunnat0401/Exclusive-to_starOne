import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  const backHome = () => {
    navigate("/");
  };
  return (
    <div style={{ height: "100vh", display: "grid", placeContent: "center" }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={backHome}>
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default Error;
