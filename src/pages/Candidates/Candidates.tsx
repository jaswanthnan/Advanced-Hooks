import React, { useEffect, useRef, useMemo, useCallback, useReducer, Profiler, useState } from 'react';
import { Tag, Avatar, Modal, Form, Input, Select, Button, Space, Typography, App } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { api } from '../../services/api';
import AgGridTable, { AgGridTableHandle } from '../../components/common/AgGridTable';
import { useDebounce, useFetch, useLocalStorage } from '../../hooks';
import { FilterPanel } from '../../components/patterns/FilterPanel';
import { Candidate } from '../../types';
import { ColDef } from 'ag-grid-community';

const { Title, Text } = Typography;

// useReducer for complex state
type State = {
  isModalVisible: boolean;
  editingCandidate: Candidate | null;
};

type Action = 
  | { type: 'OPEN_MODAL'; payload?: Candidate }
  | { type: 'CLOSE_MODAL' };

const reducer = (state: State, action: Action): State => {
  console.log(`%c [useReducer] Action: ${action.type} `, 'background: #7c3aed; color: white; padding: 2px 4px; border-radius: 4px;');
  switch (action.type) {
    case 'OPEN_MODAL':
      return { ...state, isModalVisible: true, editingCandidate: action.payload || null };
    case 'CLOSE_MODAL':
      return { ...state, isModalVisible: false, editingCandidate: null };
    default:
      return state;
  }
};

const Candidates: React.FC = () => {
  console.log('%c [Candidates] Rendering Component ', 'background: #2563eb; color: white; padding: 2px 4px; border-radius: 4px;');
  const { message, modal } = App.useApp();
  const [form] = Form.useForm();
  const gridRef = useRef<AgGridTableHandle>(null);
  
  // 1. useReducer
  const [state, dispatch] = useReducer(reducer, {
    isModalVisible: false,
    editingCandidate: null
  });

  // Log when state changes
  useEffect(() => {
    console.log('%c [useReducer] State updated: ', 'color: #7c3aed', state);
  }, [state]);

  // 2. useLocalStorage for search persistence
  const [searchTerm, setSearchTerm] = useLocalStorage<string>('candidates_search', '');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  
  // 3. useDebounce
  const debouncedSearch = useDebounce<string>(searchTerm, 300);

  // Convert active filters to query string
  const filterParams = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.append('q', debouncedSearch);
    if (activeFilters.status?.length) params.append('status', activeFilters.status.join(','));
    if (activeFilters.experience?.length) params.append('experience', activeFilters.experience.join(','));
    return params.toString();
  }, [debouncedSearch, activeFilters]);

  // 4. useFetch with full filter parameters
  const { data, loading, error, refetch } = useFetch<Candidate[]>(`http://localhost:5000/api/candidates?${filterParams}`);

  useEffect(() => {
    if (error) message.error("Failed to fetch candidates");
  }, [error]);

  const showAddModal = () => {
    form.resetFields();
    dispatch({ type: 'OPEN_MODAL' });
  };

  const showEditModal = useCallback((record: Candidate) => {
    form.setFieldsValue(record);
    dispatch({ type: 'OPEN_MODAL', payload: record });
  }, [form]);

  const handleDelete = useCallback((id: string) => {
    modal.confirm({
      title: 'Delete Candidate?',
      content: 'This action is permanent and cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await api.delete(`/candidates/${id}`);
          message.success('Candidate removed');
          refetch();
        } catch (error) {
          message.error('Delete failed');
        }
      },
    });
  }, [refetch]);

  const onFinish = async (values: any) => {
    try {
      if (state.editingCandidate) {
        await api.put(`/candidates/${state.editingCandidate._id}`, values);
        message.success("Candidate updated");
      } else {
        await api.post('/candidates', values);
        message.success("Candidate added");
      }
      dispatch({ type: 'CLOSE_MODAL' });
      refetch();
    } catch (error) {
      message.error("Operation failed");
    }
  };

  const onExportClick = useCallback(() => {
    gridRef.current?.exportData('candidates_report.csv');
  }, []);

  // 5. useMemo for local filtering
  const filteredCandidates = useMemo(() => {
    if (!data) return [];
    console.time('Filtering Candidates');
    const q = searchTerm.toLowerCase();
    
    const filtered = data.filter(c => {
      // Search matching
      const matchesSearch = (c.name || '').toLowerCase().includes(q) ||
                            (c.email || '').toLowerCase().includes(q) ||
                            (c.role || '').toLowerCase().includes(q);
      
      // Filter matching (Compound logic)
      const matchesStatus = !activeFilters.status?.length || activeFilters.status.includes(c.status);
      const matchesExperience = !activeFilters.experience?.length || activeFilters.experience.some(exp => (c.experience || '').includes(exp));

      return matchesSearch && matchesStatus && matchesExperience;
    });
    
    console.timeEnd('Filtering Candidates');
    return filtered;
  }, [data, searchTerm, activeFilters]);

  // 6. useMemo for expensive column definitions
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      field: 'name',
      headerName: 'Candidate Name',
      flex: 1.5,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} className="bg-blue-100 text-blue-600" size="small" />
          <span className="font-medium">{params.value}</span>
        </div>
      )
    },
    { field: 'email', headerName: 'Email', flex: 1.2 },
    { field: 'role', headerName: 'Applied Role', flex: 1.2 },
    { field: 'experience', headerName: 'Experience', flex: 1 },
    { 
      field: 'status', 
      headerName: 'Status',
      flex: 1,
      cellRenderer: (params: any) => {
        const colors: Record<string, string> = { Hired: 'success', Pending: 'processing', Rejected: 'error', 'In Review': 'warning' };
        return <Tag color={colors[params.value] || 'default'} className="rounded-full px-3">{params.value}</Tag>;
      }
    },
    {
      headerName: 'Actions',
      width: 120,
      cellRenderer: (params: any) => (
        <Space>
          <Button type="text" icon={<EditOutlined className="text-blue-500" />} onClick={() => showEditModal(params.data)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(params.data._id)} />
        </Space>
      )
    }
  ], [showEditModal, handleDelete]);

  return (
    <Profiler id="CandidatesPage" onRender={(id, phase, duration) => {
      if (duration > 10 || phase === 'mount') {
        console.log(`%c [Profiler] ${id} ${phase} duration: ${duration.toFixed(2)}ms`, 'color: #8b5cf6; font-weight: bold');
      }
    }}>
      <div className="p-6 space-y-6 animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex justify-between items-center">
          <Title level={3} className="m-0 dark:text-white">Candidate Pipeline [SEARCH UPDATED]</Title>
          <Space>
            <Input 
              placeholder="Search candidates..." 
              prefix={<SearchOutlined />} 
              className="w-64 rounded-xl"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoComplete="off"
            />
            <Button icon={<DownloadOutlined />} onClick={onExportClick} className="rounded-xl">Export</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} className="rounded-xl bg-blue-600 h-10 px-6">
              Add Candidate
            </Button>
          </Space>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterPanel onChange={setActiveFilters}>
              <FilterPanel.Group name="status" title="Status">
                <FilterPanel.Item group="status" value="Hired">Hired</FilterPanel.Item>
                <FilterPanel.Item group="status" value="In Review">In Review</FilterPanel.Item>
                <FilterPanel.Item group="status" value="Pending">Pending</FilterPanel.Item>
                <FilterPanel.Item group="status" value="Rejected">Rejected</FilterPanel.Item>
              </FilterPanel.Group>

              <FilterPanel.Group name="experience" title="Experience Level">
                <FilterPanel.Item group="experience" value="Entry">Entry</FilterPanel.Item>
                <FilterPanel.Item group="experience" value="Junior">Junior</FilterPanel.Item>
                <FilterPanel.Item group="experience" value="Senior">Senior</FilterPanel.Item>
                <FilterPanel.Item group="experience" value="Expert">Expert</FilterPanel.Item>
              </FilterPanel.Group>
            </FilterPanel>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <AgGridTable 
                ref={gridRef}
                gridId="candidates_grid"
                rowData={filteredCandidates}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
              />
            </div>
          </div>
        </div>

        <Modal
          title={<span className="text-xl font-bold">{state.editingCandidate ? "Edit Candidate" : "New Candidate"}</span>}
          open={state.isModalVisible}
          onCancel={() => dispatch({ type: 'CLOSE_MODAL' })}
          onOk={() => form.submit()}
          okText="Save Candidate"
          className="rounded-2xl"
          destroyOnHidden
        >
          <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6" requiredMark={false}>
            <Form.Item name="name" label={<span>Full Name <span className="text-rose-500">*</span></span>} rules={[{ required: true }]}>
              <Input placeholder="John Smith" size="large" className="rounded-xl" />
            </Form.Item>
            <Form.Item name="email" label={<span>Email Address <span className="text-rose-500">*</span></span>} rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="john@example.com" size="large" className="rounded-xl" />
            </Form.Item>
            <Form.Item name="role" label={<span>Position <span className="text-rose-500">*</span></span>} rules={[{ required: true }]}>
              <Input placeholder="Senior UI Designer" size="large" className="rounded-xl" />
            </Form.Item>
            <Form.Item name="experience" label={<span>Years of Experience <span className="text-rose-500">*</span></span>} rules={[{ required: true }]}>
              <Input placeholder="e.g. 5 Years" size="large" className="rounded-xl" />
            </Form.Item>
            <Form.Item name="status" label={<span>Current Status <span className="text-rose-500">*</span></span>} rules={[{ required: true }]}>
              <Select placeholder="Select status" size="large" className="rounded-xl">
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="In Review">In Review</Select.Option>
                <Select.Option value="Hired">Hired</Select.Option>
                <Select.Option value="Rejected">Rejected</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Profiler>
  );
};

export default Candidates;
