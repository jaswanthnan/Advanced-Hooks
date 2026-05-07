import React from 'react';
import { Typography, Card, Button, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  RocketOutlined, 
  SafetyCertificateOutlined, 
  LineChartOutlined, 
  TeamOutlined 
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  if (!context) throw new Error("Home must be used within an AppProvider");
  const { state } = context;

  const features = [
    {
      icon: <RocketOutlined className="text-blue-500 text-3xl" />,
      title: "Fast Hiring",
      desc: "Streamline your recruitment process with automated workflows."
    },
    {
      icon: <LineChartOutlined className="text-emerald-500 text-3xl" />,
      title: "Deep Analytics",
      desc: "Gain insights with our comprehensive dashboard visualizations."
    },
    {
      icon: <SafetyCertificateOutlined className="text-purple-500 text-3xl" />,
      title: "Secure Platform",
      desc: "Enterprise-grade security for all your sensitive candidate data."
    }
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="relative py-20 px-8 rounded-[40px] overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 shadow-2xl mb-16">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="relative z-1 max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <Text className="text-blue-100 font-bold tracking-wider text-xs uppercase">New Version 4.0 is Live</Text>
          </div>
          <Title className="text-white text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            Revolutionize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">Hiring Workflow</span>
          </Title>
          <Paragraph className="text-blue-100 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light leading-relaxed opacity-90">
            The all-in-one platform to manage candidates, track active jobs, and gain valuable insights through high-performance analytics.
          </Paragraph>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {!state.isAuthenticated ? (
              <>
                <Button 
                  type="primary" 
                  size="large" 
                  className="h-16 px-10 text-lg font-bold rounded-2xl bg-white text-blue-900 border-0 hover:scale-105 transition-transform"
                  onClick={() => navigate('/login')}
                >
                  Get Started Now
                </Button>
                <Button 
                  size="large" 
                  className="h-16 px-10 text-lg font-bold rounded-2xl bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20"
                  onClick={() => navigate('/jobs')}
                >
                  Browse Jobs
                </Button>
              </>
            ) : (
              <Button 
                type="primary" 
                size="large" 
                className="h-16 px-12 text-lg font-bold rounded-2xl bg-emerald-500 hover:bg-emerald-600 border-0 hover:scale-105 transition-transform"
                onClick={() => navigate('/dashboard')}
              >
                Go to Workspace
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4">
        <div className="text-center mb-16">
          <Title level={2} className="text-4xl font-bold dark:text-white mb-4">Why TalentFlow?</Title>
          <Paragraph className="text-slate-500 dark:text-slate-400 text-lg">Built for high-performance HR teams globally.</Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {features.map((f, i) => (
            <Col xs={24} md={8} key={i}>
              <Card className="h-full border-0 shadow-xl rounded-3xl dark:bg-slate-800 hover:-translate-y-2 transition-transform duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <Title level={4} className="dark:text-white mb-4">{f.title}</Title>
                <Paragraph className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                  {f.desc}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Live Stats Bar - "Page without routes" entry */}
      <div className="mt-20 py-10 px-10 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-wrap justify-around items-center gap-8">
        <div className="text-center">
          <TeamOutlined className="text-3xl text-blue-600 mb-2" />
          <Title level={3} className="m-0 dark:text-white font-black">10K+</Title>
          <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Active Candidates</Text>
        </div>
        <div className="w-px h-12 bg-slate-100 dark:bg-slate-700 hidden md:block"></div>
        <div className="text-center">
          <RocketOutlined className="text-3xl text-emerald-600 mb-2" />
          <Title level={3} className="m-0 dark:text-white font-black">500+</Title>
          <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Global Companies</Text>
        </div>
        <div className="w-px h-12 bg-slate-100 dark:bg-slate-700 hidden md:block"></div>
        <div className="text-center">
          <LineChartOutlined className="text-3xl text-purple-600 mb-2" />
          <Title level={3} className="m-0 dark:text-white font-black">98%</Title>
          <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Satisfaction rate</Text>
        </div>
      </div>
    </div>
  );
};

export default Home;
