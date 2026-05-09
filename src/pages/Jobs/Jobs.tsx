import React, { useMemo, useEffect, useCallback, useReducer, useRef, Profiler } from 'react';
import { Input, Select, Button, Typography, Space, Spin, Row, Col, App } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { useDebounce, useLocalStorage, useFetch } from '../../hooks';
import JobCard from './JobCard';
import JobModal, { JobModalRef } from './JobModal';
import { Job } from '../../types';

// useReducer for complex state management
type State = {
  data: Job[];
  filterType: string;
};

type Action = 
  | { type: 'SET_DATA'; payload: Job[] }
  | { type: 'SET_FILTER'; payload: string };

const reducer = (state: State, action: Action): State => {
  console.log(`%c [useReducer] Action: ${action.type} `, 'background: #7c3aed; color: white; padding: 2px 4px; border-radius: 4px;');
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_FILTER':
      return { ...state, filterType: action.payload };
    default:
      return state;
  }
};

const Jobs: React.FC = () => {
  const { message, modal } = App.useApp();
  const { state: authState } = useApp();
  const navigate = useNavigate();
  const modalRef = useRef<JobModalRef>(null);

  // 1. useReducer: Manages data and filters in a single state object
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    filterType: 'All'
  });

  // 2. useLocalStorage: Persists search input across page refreshes
  const [searchTerm, setSearchTerm] = useLocalStorage<string>('jobs_search', '');
  
  // 3. useDebounce: Delays search processing to improve UI responsiveness
  const debouncedSearch = useDebounce<string>(searchTerm, 300);

  // 4. useFetch + AbortController: Fetches jobs and cancels request on unmount
  // Including debouncedSearch in URL to trigger visible Network calls
  const { data: rawJobs, loading, error: fetchError, refetch } = useFetch<Job[]>(`http://localhost:5000/api/jobs?q=${debouncedSearch}`);

  useEffect(() => {
    if (rawJobs) dispatch({ type: 'SET_DATA', payload: rawJobs });
    if (fetchError) message.error('Failed to fetch jobs');
  }, [rawJobs, fetchError]);

  /**
   * 5. useCallback: Memoizes event handlers to prevent JobCard (React.memo) 
   * from re-rendering unnecessarily.
   */
  const handleApply = useCallback((job: Job) => {
    console.log('%c [useCallback] handleApply triggered ', 'background: #222; color: #bada55');
    if (!authState.isAuthenticated) {
      message.info('Please login to apply for this job');
      navigate('/login', { state: { from: { pathname: '/jobs' } } });
      return;
    }
    modalRef.current?.openApply(job);
  }, [authState.isAuthenticated, navigate]);

  const handleEdit = useCallback((job: Job) => {
    console.log('%c [useCallback] handleEdit triggered ', 'background: #222; color: #3498db');
    modalRef.current?.openPost(job);
  }, []);

  const handleDelete = useCallback((id: string) => {
    console.log(`%c [useCallback] handleDelete triggered for ID: ${id} `, 'background: #222; color: #f87171');
    modal.confirm({
      title: 'Delete Job Posting?',
      content: 'Are you sure you want to delete this job?',
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await api.delete(`/jobs/${id}`);
          message.success('Job deleted successfully!');
          refetch();
        } catch (error: any) {
          message.error(error.message || 'Failed to delete job');
        }
      }
    });
  }, [refetch]);

  /**
   * 6. useMemo: Memoizes the filtering calculation. 
   * Check console for "Filtering Jobs" execution time.
   */
  const filteredJobs = useMemo(() => {
    console.time('Filtering Jobs');
    const filtered = state.data.filter(job => {
      const titleMatches = (job.title || '').toLowerCase().includes(debouncedSearch.toLowerCase());
      const departmentMatches = (job.department || '').toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesSearch = titleMatches || departmentMatches;
      const matchesType = state.filterType === 'All' || job.type === state.filterType;
      return matchesSearch && matchesType;
    });
    console.timeEnd('Filtering Jobs');
    return filtered;
  }, [state.data, debouncedSearch, state.filterType]);

  // 7. React Profiler callback
  const onRenderCallback = (
    id: string,
    phase: "mount" | "update" | "nested-update",
    actualDuration: number
  ) => {
    if (actualDuration > 10 || phase === 'mount') { 
      console.log(`%c [Profiler] ${id} (${phase}): ${actualDuration.toFixed(2)}ms`, 'color: #e67e22; font-weight: bold');
    }
  };

  return (
    <Profiler id="JobsPage" onRender={onRenderCallback}>
      <div className="p-6 min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <Typography.Title level={2} className="m-0 dark:text-white">Job Opportunities</Typography.Title>
          <Space wrap>
            <Input
              placeholder="Search roles..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 rounded-xl"
              allowClear
              autoComplete="off"
            />
            <Select
              value={state.filterType}
              onChange={(val) => dispatch({ type: 'SET_FILTER', payload: val })}
              className="w-40"
              options={[
                { value: 'All', label: 'All Types' },
                { value: 'Full-time', label: 'Full-time' },
                { value: 'Part-time', label: 'Part-time' },
                { value: 'Contract', label: 'Contract' },
              ]}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => modalRef.current?.openPost()}
              className="rounded-xl bg-blue-600 h-10 px-6 font-bold"
            >
              Post Job
            </Button>
          </Space>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64"><Spin size="large" /></div>
        ) : (
          <Row gutter={[24, 24]}>
            {filteredJobs.map(job => (
              <Col xs={24} md={12} xl={8} key={job._id}>
                {/* 8. React.memo: JobCard is wrapped in React.memo in its own file */}
                <JobCard
                  job={job}
                  onApply={handleApply}
                  onEdit={authState.isAuthenticated ? handleEdit : undefined}
                  onDelete={authState.isAuthenticated ? handleDelete : undefined}
                />
              </Col>
            ))}
          </Row>
        )}

        {/* 9. forwardRef + useImperativeHandle: Used in JobModal.tsx */}
        <JobModal ref={modalRef} onSuccess={refetch} />
      </div>
    </Profiler>
  );
};

export default Jobs;
