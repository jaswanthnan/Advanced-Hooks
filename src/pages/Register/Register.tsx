import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Divider, App } from 'antd';
import { 
  UserOutlined, MailOutlined, LockOutlined, 
  GoogleOutlined, GithubOutlined 
} from '@ant-design/icons';
import { api } from '../../services/api';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      message.loading({ content: 'Creating your account...', key: 'register' });
      await api.post('/auth/register', values);
      message.success({ content: 'Account created! You can now login.', key: 'register' });
      navigate('/login');
    } catch (error: any) {
      message.error({ content: error.message || 'Registration failed', key: 'register' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card 
        className="w-full max-w-lg rounded-3xl border-0 shadow-2xl overflow-hidden dark:bg-slate-900"
        styles={{ body: { padding: 0 } }}
      >
        <div className="bg-blue-600 p-8 text-center text-white">
          <Title level={2} className="m-0 text-white">Join TalentFlow</Title>
          <Text className="text-blue-100 text-lg">Start managing your hiring process today</Text>
        </div>

        <div className="p-8">
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            requiredMark={false}
          >
            <Form.Item
              name="fullName"
              label={<span className="text-slate-600 dark:text-slate-300 font-medium">Full Name</span>}
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-slate-400" />} 
                placeholder="Sarah Jenkins" 
                className="rounded-xl h-12"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span className="text-slate-600 dark:text-slate-300 font-medium">Email Address</span>}
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-slate-400" />} 
                placeholder="sarah@example.com" 
                className="rounded-xl h-12"
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="password"
                label={<span className="text-slate-600 dark:text-slate-300 font-medium">Password</span>}
                rules={[{ required: true, message: 'Minimum 6 characters', min: 6 }]}
              >
                <Input.Password 
                  prefix={<LockOutlined className="text-slate-400" />} 
                  placeholder="••••••••" 
                  className="rounded-xl h-12"
                />
              </Form.Item>

              <Form.Item
                name="confirm"
                label={<span className="text-slate-600 dark:text-slate-300 font-medium">Confirm Password</span>}
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined className="text-slate-400" />} 
                  placeholder="••••••••" 
                  className="rounded-xl h-12"
                />
              </Form.Item>
            </div>

            <Form.Item className="mt-4 mb-6">
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading}
                className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 border-0 font-bold text-lg shadow-lg shadow-blue-200 dark:shadow-none"
              >
                Create Account
              </Button>
            </Form.Item>

            <div className="text-center mb-6">
              <Text className="text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold">
                  Sign In
                </Link>
              </Text>
            </div>

            <Divider className="text-slate-400 text-xs uppercase tracking-widest">or register with</Divider>

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

export default Register;
