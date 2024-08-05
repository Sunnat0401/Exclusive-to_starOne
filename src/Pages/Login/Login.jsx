import React, { useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import './login.css';
import { setLocalStorage, signin, tokenKey } from './Auth/Auth.jsx';
import { useNavigate } from 'react-router-dom';
  

// create by To'xtaqulov Sunnat for reference [ +998901249484 , +998936689974 ] , @Sunnat_0401 , sunnattoxtaqulov@gmail.com 


const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        
        try {
            const res = await signin(values);
            if (res && res?.data?.data?.tokens?.accessToken?.token) {
                setLocalStorage(tokenKey, res?.data?.data?.tokens?.accessToken?.token);
                console.log(res);
                message.success("Muvaffaqiyatli o'tildi");
                navigate('/');
            } else {
                message.error("Login yoki parol noto'g'ri");
            }
        } catch (err) {
            console.log(err);
            message.error("Login yoki parol noto'g'ri");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    };

    const handlePasswordKeyPress = (event) => {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode < 97 || charCode > 122) {
            event.preventDefault();
        }
    };

    return (
        <div className="login-container">
            <Form
                className="login-form"
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Maxfiy raqam"
                    name="phone_number"
                    rules={[
                        { required: true, message: 'Iltimos, telefon raqamingizni kiriting!' },
                        { pattern: /^\d{9}$/, message: 'Telefon raqam 9 ta raqamdan iborat bo"lishi kerak!' }
                    ]}
                >
                    <Input maxLength={9} onKeyPress={handleKeyPress} />
                </Form.Item>

                <Form.Item
                    label="Parol"
                    name="password"
                    rules={[{ required: true, message: 'Iltimos, parolingizni kiriting!' }]}
                >
                    <Input.Password onKeyPress={handlePasswordKeyPress} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Kirish
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
