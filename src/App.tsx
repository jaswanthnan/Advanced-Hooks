import React from 'react';
import { ConfigProvider, theme, App as AntApp } from 'antd';
import { AppProvider, useApp } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';

const AppWrapper: React.FC = () => {
  const { state } = useApp();
  const isDarkMode = state.theme === 'dark';

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 12,
        }
      }}
    >
      <AntApp>
        <AppRoutes />
      </AntApp>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppWrapper />
    </AppProvider>
  );
};

export default App;
