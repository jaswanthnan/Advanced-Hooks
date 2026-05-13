import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Menu, Button, Avatar, Dropdown } from 'antd';
import { 
  DashboardOutlined, TeamOutlined, ProfileOutlined, 
  BulbOutlined, BulbFilled, LogoutOutlined, 
  UserOutlined, HomeOutlined 
} from '@ant-design/icons';
import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const { Header, Content, Sider } = AntLayout;

const AppLayout = () => {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const isDarkMode = state.theme === 'dark';

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <NavLink to="/">Home</NavLink>,
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <NavLink to="/dashboard">Dashboard</NavLink>,
    },
    {
      key: 'candidates',
      icon: <TeamOutlined />,
      label: <NavLink to="/candidates">Candidates</NavLink>,
    },
    {
      key: 'jobs',
      icon: <ProfileOutlined />,
      label: <NavLink to="/jobs">Jobs</NavLink>,
    },
    {
      key: 'patterns',
      icon: <BulbOutlined />,
      label: <NavLink to="/patterns">Patterns</NavLink>,
    },
  ];

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }} className="bg-slate-50 dark:bg-slate-900">
      <Sider 
        breakpoint="lg" 
        collapsedWidth="0" 
        width={260} 
        theme={isDarkMode ? 'dark' : 'light'} 
        className="border-r border-slate-200 dark:border-slate-800 shadow-xl fixed h-screen left-0 top-0 bottom-0"
        style={{ zIndex: 1001 }}
      >
        <div className="h-full overflow-y-auto overflow-x-hidden">
          <Menu 
            theme={isDarkMode ? 'dark' : 'light'} 
            mode="inline" 
            selectedKeys={[location.pathname]} 
            items={menuItems} 
            className="border-0 px-2 py-4"
          />
        </div>
      </Sider>

      <AntLayout className="bg-transparent lg:ml-[260px] transition-all duration-300">
        <Header className={`${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'} px-6 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md border-b h-16`}>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold dark:text-white m-0 tracking-wide">
              {location.pathname === '/' ? 'HOME' : location.pathname.split('/')[1]?.toUpperCase()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="text"
              shape="circle"
              icon={isDarkMode ? <BulbFilled className="text-amber-400" /> : <BulbOutlined />}
              onClick={toggleTheme}
            />
            
            {state.isAuthenticated ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div className="flex items-center gap-3 cursor-pointer p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <Avatar icon={<UserOutlined />} className="bg-blue-600 shadow-md" />
                  <div className="hidden md:block">
                    <p className="text-sm font-medium leading-none dark:text-white">{state.user?.name}</p>
                    <p className="text-xs text-slate-500 leading-none mt-1">{state.user?.role}</p>
                  </div>
                </div>
              </Dropdown>
            ) : (
              <Button type="primary" className="rounded-full px-6" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </div>
        </Header>

        <Content className="p-4 md:p-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default AppLayout;
