import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Form, Input, Button, Card, Typography, Divider, App } from 'antd';
import { 
  UserOutlined, LockOutlined, LoginOutlined, 
  GoogleOutlined, GithubOutlined 
} from '@ant-design/icons';
import { api } from '../../services/api';
import { User } from '../../types';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const { message } = App.useApp();
  const { dispatch } = useApp();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      message.loading({ content: 'Authenticating...', key: 'login' });
      const user = await api.post<User>('/auth/login', values);
      
      dispatch({ type: 'LOGIN', payload: user });
      message.success({ content: 'Login successful!', key: 'login' });
      navigate(from, { replace: true });
    } catch (error: any) {
      message.error({ content: error.message || 'Invalid username or password', key: 'login' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card 
        className="w-full max-w-md rounded-3xl border-0 shadow-2xl overflow-hidden dark:bg-slate-900"
        styles={{ body: { padding: 0 } }}
      >
        <div className="bg-blue-600 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <LoginOutlined className="text-3xl" />
          </div>
          <Title level={2} className="m-0 text-white">Welcome Back</Title>
          <Text className="text-blue-100">Sign in to manage your recruitment</Text>
        </div>

        <div className="p-8">
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-slate-400" />} 
                placeholder="Username or Email" 
                className="rounded-xl h-12"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-slate-400" />} 
                placeholder="Password" 
                className="rounded-xl h-12"
                autoComplete="current-password"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-6">
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Create an account
              </Link>
              <a href="#" className="text-slate-500 hover:text-slate-600 text-sm">
                Forgot password?
              </a>
            </div>

            <Form.Item className="mb-6">
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading}
                className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 border-0 font-bold text-lg shadow-lg shadow-blue-200 dark:shadow-none"
              >
                Sign In
              </Button>
            </Form.Item>

            <Divider className="text-slate-400 text-xs uppercase tracking-widest">or continue with</Divider>

            <div className="grid grid-cols-2 gap-4">
              <Button icon={<GoogleOutlined />} className="h-12 rounded-xl border-slate-200 hover:border-blue-500 flex items-center justify-center font-medium">
                Google
              </Button>
              <Button icon={<GithubOutlined />} className="h-12 rounded-xl border-slate-200 hover:border-blue-500 flex items-center justify-center font-medium">
                GitHub
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default Login;
