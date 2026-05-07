import React, { useState, useMemo, useEffect, useContext, useCallback } from 'react';
import { Form, Input, Select, Button, Modal, Typography, Space, Spin, Row, Col, App } from 'antd';
import { SearchOutlined, PlusOutlined, SendOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { useDebounce, useLocalStorage, useFetch } from '../../hooks';
import JobCard from './JobCard';
import { Job } from '../../types';

const { Title, Text } = Typography;
// const { confirm } = Modal; (using App.useApp)

const Jobs: React.FC = () => {
  const { message, modal } = App.useApp();
  const { state } = useApp();
  const navigate = useNavigate();

  // Refactored to use useFetch hook with AbortController and Refetch support
  const { data: rawJobs, loading, error: fetchError, refetch } = useFetch<Job[]>('http://localhost:5000/api/jobs');
  const [data, setData] = useState<Job[]>([]);

  const [isApplyModalVisible, setIsApplyModalVisible] = useState<boolean>(false);
  const [isPostModalVisible, setIsPostModalVisible] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [searchTerm, setSearchTerm] = useLocalStorage<string>('jobs_search', '');
  const [filterType, setFilterType] = useState<string>('All');
  const debouncedSearch = useDebounce<string>(searchTerm, 300);

  const [applyForm] = Form.useForm();
  const [postForm] = Form.useForm();

  useEffect(() => {
    if (rawJobs) setData(rawJobs);
    if (fetchError) message.error('Failed to fetch jobs');
  }, [rawJobs, fetchError]);

  const handleApply = useCallback((job: Job) => {
    if (!state.isAuthenticated) {
      message.info('Please login to apply for this job');
      navigate('/login', { state: { from: { pathname: '/jobs' } } });
      return;
    }
    setSelectedJob(job);
    setIsApplyModalVisible(true);
  }, [state.isAuthenticated, navigate]);

  const handleEdit = useCallback((job: Job) => {
    setEditingJob(job);
    postForm.setFieldsValue(job);
    setIsPostModalVisible(true);
  }, [postForm]);

  const handleDelete = useCallback((id: string) => {
    modal.confirm({
      title: 'Delete Job Posting?',
      content: 'Are you sure you want to delete this job? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          message.loading({ content: 'Deleting job...', key: 'delete' });
          await api.delete(`/jobs/${id}`);
          message.success({ content: 'Job deleted successfully!', key: 'delete' });
          refetch();
        } catch (error: any) {
          message.error({ content: error.message || 'Failed to delete job', key: 'delete' });
        }
      }
    });
  }, [refetch]);

  const onApplyFinish = async (values: any) => {
    if (!selectedJob) return;
    try {
      message.loading({ content: 'Submitting application...', key: 'apply' });
      const applicationData = {
        name: values.name,
        email: values.email,
        role: selectedJob.title,
        experience: values.experience,
        status: 'Pending'
      };
      await api.post('/candidates', applicationData);
      message.success({ content: 'Application submitted successfully!', key: 'apply' });
      setIsApplyModalVisible(false);
      applyForm.resetFields();
    } catch (error: any) {
      message.error({ content: error.message || 'Failed to submit application', key: 'apply' });
    }
  };

  const onPostJobFinish = async (values: any) => {
    try {
      if (editingJob) {
        message.loading({ content: 'Updating job...', key: 'post' });
        await api.put(`/jobs/${editingJob._id}`, { ...values, status: editingJob.status || 'Active' });
        message.success({ content: 'Job updated successfully!', key: 'post' });
      } else {
        message.loading({ content: 'Posting new job...', key: 'post' });
        await api.post('/jobs', { ...values, status: 'Active' });
        message.success({ content: 'Job posted successfully!', key: 'post' });
      }
      setIsPostModalVisible(false);
      setEditingJob(null);
      postForm.resetFields();
      refetch();
    } catch (error: any) {
      message.error({ content: error.message || 'Failed to process job', key: 'post' });
    }
  };

  const filteredJobs = useMemo(() => {
    return data.filter(job => {
      const titleMatches = (job.title || '').toLowerCase().includes(debouncedSearch.toLowerCase());
      const departmentMatches = (job.department || '').toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesSearch = titleMatches || departmentMatches;
      const matchesType = filterType === 'All' || job.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [data, debouncedSearch, filterType]);

  return (
    <div className="p-6 min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div /> {/* Spacer for flex layout */}
        <Space wrap>
          <Input
            placeholder="Search roles or departments..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 rounded-xl"
            allowClear
          />
          <Select
            value={filterType}
            onChange={setFilterType}
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
            onClick={() => {
              setEditingJob(null);
              postForm.resetFields();
              setIsPostModalVisible(true);
            }}
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
              <JobCard
                job={job}
                onApply={handleApply}
                onEdit={state.isAuthenticated ? handleEdit : undefined}
                onDelete={state.isAuthenticated ? handleDelete : undefined}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Apply Modal */}
      <Modal
        title={<span className="text-xl font-bold">Apply for {selectedJob?.title}</span>}
        open={isApplyModalVisible}
        onCancel={() => setIsApplyModalVisible(false)}
        footer={null}
        destroyOnHidden
        className="rounded-2xl"
      >
        <Form form={applyForm} layout="vertical" onFinish={onApplyFinish} className="mt-6" requiredMark={false}>
          <Form.Item name="name" label={<span>Full Name <span className="text-rose-500">*</span></span>} rules={[{ required: true }]}><Input placeholder="John Doe" size="large" className="rounded-xl" /></Form.Item>
          <Form.Item name="email" label={<span>Email Address <span className="text-rose-500">*</span></span>} rules={[{ required: true, type: 'email' }]}><Input placeholder="name@example.com" size="large" className="rounded-xl" /></Form.Item>
          <Form.Item name="experience" label={<span>Years of Experience <span className="text-rose-500">*</span></span>} rules={[{ required: true }]}><Input placeholder="e.g. 5 Years" size="large" className="rounded-xl" /></Form.Item>
          <div className="flex gap-4 mt-8">
            <Button size="large" block onClick={() => setIsApplyModalVisible(false)} className="rounded-xl">Cancel</Button>
            <Button type="primary" size="large" block htmlType="submit" className="rounded-xl bg-blue-600 border-0 h-12">Submit Application</Button>
          </div>
        </Form>
      </Modal>

      {/* Post/Edit Job Modal */}
      <Modal
        title={<span className="text-xl font-bold text-blue-600">{editingJob ? 'Edit Job Posting' : 'Post a New Job'}</span>}
        open={isPostModalVisible}
        onCancel={() => {
          setIsPostModalVisible(false);
          setEditingJob(null);
        }}
        footer={null}
        destroyOnHidden
        className="rounded-2xl"
      >
        <Form form={postForm} layout="vertical" onFinish={onPostJobFinish} className="mt-6" requiredMark={false}>
          <Form.Item name="title" label={<span>Job Title <span className="text-rose-500">*</span></span>} rules={[{ required: true }]}><Input placeholder="e.g. Senior Frontend Developer" size="large" className="rounded-xl" /></Form.Item>
          <Form.Item name="type" label={<span>Job Type <span className="text-rose-500">*</span></span>} rules={[{ required: true }]}>
            <Select placeholder="Select Type" size="large" className="rounded-xl">
              <Select.Option value="Full-time">Full-time</Select.Option>
              <Select.Option value="Part-time">Part-time</Select.Option>
              <Select.Option value="Contract">Contract</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="department" label={<span>Department <span className="text-rose-500">*</span></span>} rules={[{ required: true }]}><Input placeholder="e.g. Engineering" size="large" className="rounded-xl" /></Form.Item>
          <Form.Item name="location" label={<span>Location <span className="text-rose-500">*</span></span>} rules={[{ required: true }]}><Input placeholder="e.g. Remote or San Francisco, CA" size="large" className="rounded-xl" /></Form.Item>
          <div className="flex gap-4 mt-8">
            <Button size="large" block onClick={() => {
              setIsPostModalVisible(false);
              setEditingJob(null);
            }} className="rounded-xl">Cancel</Button>
            <Button type="primary" size="large" block htmlType="submit" icon={editingJob ? <EditOutlined /> : <SendOutlined />} className="rounded-xl bg-blue-600 border-0 h-12 font-bold">
              {editingJob ? 'Update Listing' : 'Post Listing'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Jobs;
