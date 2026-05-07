import React, { useContext, useEffect, useMemo, useCallback, useRef, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { Card, Statistic, App } from 'antd';
import { 
  UserOutlined, TeamOutlined, CheckCircleOutlined, DownloadOutlined,
  PlusOutlined, DeleteOutlined
} from '@ant-design/icons';
import AgGridTable from '../../components/common/AgGridTable';
import { Candidate, Job } from '../../types';
import { ColDef, GridReadyEvent } from 'ag-grid-community';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

interface DashboardState {
  candidates: Candidate[];
  jobs: Job[];
  loading: boolean;
  filterStatus: string | null;
  error: string | null;
}

type DashboardAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { candidates: Candidate[]; jobs: Job[] } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_FILTER'; payload: string | null };

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, candidates: action.payload.candidates, jobs: action.payload.jobs };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_FILTER':
      return { ...state, filterStatus: action.payload };
    default:
      return state;
  }
};

const initialState: DashboardState = {
  candidates: [],
  jobs: [],
  loading: true,
  filterStatus: null,
  error: null,
};

const Dashboard: React.FC = () => {
  const { message } = App.useApp();
  const { state: globalState } = useApp();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const gridRef = useRef<GridReadyEvent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_START' });
        const [cRes, jRes] = await Promise.all([
          api.get<Candidate[]>('/candidates'),
          api.get<Job[]>('/jobs')
        ]);
        dispatch({ type: 'FETCH_SUCCESS', payload: { candidates: cRes, jobs: jRes } });
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: "Failed to fetch dashboard data" });
        message.error("Failed to fetch dashboard data");
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const { candidates } = state;
    return {
      total: candidates.length,
      hired: candidates.filter(c => c.status?.toLowerCase() === 'hired').length,
      pending: candidates.filter(c => c.status?.toLowerCase() === 'pending' || c.status?.toLowerCase() === 'in review').length,
      rejected: candidates.filter(c => c.status?.toLowerCase() === 'rejected').length,
    };
  }, [state.candidates]);

  const candidatesChartData = useMemo(() => {
    const statusCounts = state.candidates.reduce((acc: Record<string, number>, c) => {
      const status = c.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));
  }, [state.candidates]);

  const jobsChartData = useMemo(() => {
    const typeCounts = state.jobs.reduce((acc: Record<string, number>, j) => {
      const type = j.type || 'Full-time';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(typeCounts).map(key => ({ name: key, value: typeCounts[key] }));
  }, [state.jobs]);

  const filteredData = useMemo(() => {
    if (!state.filterStatus) return state.candidates;
    return state.candidates.filter(c => c.status?.toLowerCase() === state.filterStatus?.toLowerCase());
  }, [state.candidates, state.filterStatus]);

  const onExportClick = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv({ fileName: 'dashboard_candidates.csv' });
    }
  }, []);

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'name', headerName: 'Full Name', flex: 1.5 },
    { field: 'email', headerName: 'Email Address', flex: 1.5 },
    { field: 'role', headerName: 'Job Role', flex: 1.2 },
    { field: 'status', headerName: 'Application Status', flex: 1, cellRenderer: (params: any) => {
      const colors: Record<string, string> = { 'Hired': '#10b981', 'In Review': '#3b82f6', 'Pending': '#f59e0b', 'Rejected': '#ef4444' };
      return <span style={{ color: colors[params.value] || '#94a3b8', fontWeight: 'bold' }}>{params.value}</span>
    }},
    { field: 'experience', headerName: 'Experience', flex: 1 },
  ], []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          hoverable 
          className={`cursor-pointer transition-all border-l-4 border-blue-500 ${!state.filterStatus ? 'bg-blue-50 shadow-inner' : ''}`}
          onClick={() => dispatch({ type: 'SET_FILTER', payload: null })}
        >
          <Statistic title="Total Candidates" value={stats.total} prefix={<TeamOutlined className="text-blue-500 mr-2" />} />
        </Card>
        <Card 
          hoverable 
          className={`cursor-pointer transition-all border-l-4 border-emerald-500 ${state.filterStatus === 'hired' ? 'bg-emerald-50 shadow-inner' : ''}`}
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'hired' })}
        >
          <Statistic title="Hired" value={stats.hired} prefix={<CheckCircleOutlined className="text-emerald-500 mr-2" />} />
        </Card>
        <Card 
          hoverable 
          className={`cursor-pointer transition-all border-l-4 border-amber-500 ${state.filterStatus === 'pending' ? 'bg-amber-50 shadow-inner' : ''}`}
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'pending' })}
        >
          <Statistic title="In Review" value={stats.pending} prefix={<UserOutlined className="text-amber-500 mr-2" />} />
        </Card>
        <Card 
          hoverable 
          className={`cursor-pointer transition-all border-l-4 border-rose-500 ${state.filterStatus === 'rejected' ? 'bg-rose-50 shadow-inner' : ''}`}
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'rejected' })}
        >
          <Statistic title="Rejected" value={stats.rejected} prefix={<DeleteOutlined className="text-rose-500 mr-2" />} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-[350px]">
          <h4 className="text-base font-bold mb-4 dark:text-white">Jobs Distribution</h4>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={jobsChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} fill="#10B981" label>
                {jobsChartData.map((_entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <RechartsTooltip /><Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-[350px]">
          <h4 className="text-base font-bold mb-4 dark:text-white">Experience Trends</h4>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={candidatesChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Line type="monotone" name="Count" dataKey="value" stroke="#F59E0B" strokeWidth={3} dot={{ r: 6, fill: '#F59E0B' }} activeDot={{ r: 8 }} />
              <RechartsTooltip /><Legend verticalAlign="top" align="right" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold m-0 dark:text-white">
            {state.filterStatus ? `${state.filterStatus.charAt(0).toUpperCase() + state.filterStatus.slice(1)} Candidates` : 'Manage All Candidates'}
          </h3>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl font-semibold dark:text-white" onClick={onExportClick}>
              <DownloadOutlined /> Export
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200" onClick={() => navigate('/candidates')}>
              <PlusOutlined /> Add New
            </button>
          </div>
        </div>

        <AgGridTable onGridReady={(params: GridReadyEvent) => gridRef.current = params} rowData={filteredData} columnDefs={columnDefs} pagination={true} paginationPageSize={10} />
      </div>
    </div>
  );
};

export default Dashboard;
