import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Tag, Avatar, Modal, Form, Input, Select, Button, Space, Typography, App } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { api } from '../../services/api';
import AgGridTable, { AgGridTableHandle } from '../../components/common/AgGridTable';
import { useDebounce } from '../../hooks';
import { Candidate } from '../../types';
import { ColDef } from 'ag-grid-community';

// const { confirm } = Modal; (will use hook instead)
const { Title, Text } = Typography;

const Candidates: React.FC = () => {
  const { message, modal } = App.useApp();
  const [data, setData] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [form] = Form.useForm();
  
  // Ref for the grid component (now using forwardRef)
  const gridRef = useRef<AgGridTableHandle>(null);
  
  // Debounce search to prevent excessive grid updates
  const debouncedSearch = useDebounce<string>(searchTerm, 300);

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.get<Candidate[]>('/candidates');
      setData(result);
    } catch (error) {
      message.error("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // Update grid quick filter when debounced search changes
  useEffect(() => {
    gridRef.current?.setQuickFilter(debouncedSearch);
  }, [debouncedSearch]);

  const showAddModal = () => {
    setEditingCandidate(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = useCallback((record: Candidate) => {
    setEditingCandidate(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
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
          fetchCandidates();
        } catch (error) {
          message.error('Delete failed');
        }
      },
    });
  }, [fetchCandidates]);

  const onFinish = async (values: any) => {
    try {
      if (editingCandidate) {
        await api.put(`/candidates/${editingCandidate._id}`, values);
        message.success("Candidate updated");
      } else {
        await api.post('/candidates', values);
        message.success("Candidate added");
      }
      setIsModalVisible(false);
      fetchCandidates();
    } catch (error) {
      message.error("Operation failed");
    }
  };

  const onExportClick = useCallback(() => {
    // Calling the exposed method from AgGridTable
    gridRef.current?.exportData('candidates_report.csv');
  }, []);

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
    <div className="p-6 space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-center">
        <div /> {/* Spacer for flex layout */}
        <Space>
          <Input 
            placeholder="Search candidates..." 
            prefix={<SearchOutlined />} 
            className="w-64 rounded-xl"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Button icon={<DownloadOutlined />} onClick={onExportClick} className="rounded-xl">Export</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} className="rounded-xl bg-blue-600 h-10 px-6">
            Add Candidate
          </Button>
        </Space>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <AgGridTable 
          ref={gridRef}
          rowData={data}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
        />
      </div>

      <Modal
        title={<span className="text-xl font-bold">{editingCandidate ? "Edit Candidate" : "New Candidate"}</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
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
  );
};

export default Candidates;
