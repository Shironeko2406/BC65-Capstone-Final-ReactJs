import React, { useEffect } from "react";
import { Button, Checkbox, Form, Grid, Input, theme, Typography } from "antd";
import { useDispatch } from "react-redux";
import { FacebookOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { loginActionApi } from "../Redux/Reducers/UsersReducer";
import { DispatchType } from "../Redux/store";
import { LoginFormValues } from "../Models/UserModalType";
import { signInWithFacebook } from "../Firebase/Config";
import { useLoading } from "../Contexts/LoadingContext";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

const Login: React.FC = () => {
  const { setLoading } = useLoading();
  const accessToken = localStorage.getItem("accessToken");
  const { token } = useToken();
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const dispatch: DispatchType = useDispatch();
  const onFinish = async (values: LoginFormValues) => {
    try {
      console.log("Received values of form: ", values);
      const loginActionThunk = loginActionApi(values.email, values.passWord);
      await dispatch(loginActionThunk);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center" as const,
      width: "100%",
    },
    forgotPassword: {
      float: "right" as const,
    },
    header: {
      marginBottom: token.marginXL,
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  useEffect(() => {
    if (accessToken) {
      setLoading(true);
      setTimeout(() => {
        navigate("/home", { replace: true });
        setLoading(false);
      }, 1000); // Giả lập thời gian load
    }
  }, [accessToken, navigate, setLoading]);

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.464294" width="24" height="24" rx="4.8" fill="#1890FF" />
            <path
              d="M14.8643 3.6001H20.8643V9.6001H14.8643V3.6001Z"
              fill="white"
            />
            <path
              d="M10.0643 9.6001H14.8643V14.4001H10.0643V9.6001Z"
              fill="white"
            />
            <path
              d="M4.06427 13.2001H11.2643V20.4001H4.06427V13.2001Z"
              fill="white"
            />
          </svg>

          <Title style={styles.title}>Sign in</Title>
          <Text style={styles.text}>
            Welcome back to my store! Please enter your details below to sign
            in.
          </Text>
        </div>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="passWord"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a style={styles.forgotPassword} href="">
              Forgot password?
            </a>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
            <Button
              block
              type="default"
              icon={<FacebookOutlined />}
              onClick={signInWithFacebook}
              style={{
                marginTop: "16px",
                backgroundColor: "#4267B2",
                borderColor: "#4267B2",
                color: "white",
                fontSize: "16px",
              }}
            >
              Login with Facebook
            </Button>
            <div style={styles.footer}>
              <Text style={styles.text}>Don't have an account?</Text>{" "}
              <NavLink to="/register">Sign up now</NavLink>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default Login;
