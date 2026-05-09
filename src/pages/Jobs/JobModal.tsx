import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, Form, Input, Select, Button, message as antdMessage } from 'antd';
import { SendOutlined, EditOutlined } from '@ant-design/icons';
import { Job } from '../../types';
import { api } from '../../services/api';

export interface JobModalRef {
  openApply: (job: Job) => void;
  openPost: (job?: Job) => void;
}

interface JobModalProps {
  onSuccess: () => void;
}

const JobModal = forwardRef<JobModalRef, JobModalProps>(({ onSuccess }, ref) => {
  const [isApplyVisible, setIsApplyVisible] = useState(false);
  const [isPostVisible, setIsPostVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  const [applyForm] = Form.useForm();
  const [postForm] = Form.useForm();

  // Exposing methods to parent via useImperativeHandle
  useImperativeHandle(ref, () => ({
    openApply: (job: Job) => {
      console.log(`%c [useImperativeHandle] openApply called for: ${job.title} `, 'background: #db2777; color: white; padding: 2px 4px; border-radius: 4px;');
      setSelectedJob(job);
      setIsApplyVisible(true);
    },
    openPost: (job?: Job) => {
      console.log(`%c [useImperativeHandle] openPost called ${job ? `for: ${job.title}` : '(New Job)'} `, 'background: #db2777; color: white; padding: 2px 4px; border-radius: 4px;');
      if (job) {
        setEditingJob(job);
        postForm.setFieldsValue(job);
      } else {
        setEditingJob(null);
        postForm.resetFields();
      }
      setIsPostVisible(true);
    }
  }));

  const onApplyFinish = async (values: any) => {
    if (!selectedJob) return;
    try {
      const hide = antdMessage.loading('Submitting application...', 0);
      const applicationData = {
        name: values.name,
        email: values.email,
        role: selectedJob.title,
        experience: values.experience,
        status: 'Pending'
      };
      await api.post('/candidates', applicationData);
      hide();
      antdMessage.success('Application submitted successfully!');
      setIsApplyVisible(false);
      applyForm.resetFields();
    } catch (error: any) {
      antdMessage.error(error.message || 'Failed to submit application');
    }
  };

  const onPostFinish = async (values: any) => {
    try {
      const hide = antdMessage.loading(editingJob ? 'Updating job...' : 'Posting new job...', 0);
      if (editingJob) {
        await api.put(`/jobs/${editingJob._id}`, { ...values, status: editingJob.status || 'Active' });
        antdMessage.success('Job updated successfully!');
      } else {
        await api.post('/jobs', { ...values, status: 'Active' });
        antdMessage.success('Job posted successfully!');
      }
      hide();
      setIsPostVisible(false);
      onSuccess();
    } catch (error: any) {
      antdMessage.error(error.message || 'Failed to process job');
    }
  };

  return (
    <>
      {/* Apply Modal */}
      <Modal
        title={<span className="text-xl font-bold">Apply for {selectedJob?.title}</span>}
        open={isApplyVisible}
        onCancel={() => setIsApplyVisible(false)}
        footer={null}
        destroyOnHidden
        className="rounded-2xl"
      >
        <Form form={applyForm} layout="vertical" onFinish={onApplyFinish} className="mt-6" requiredMark={false}>
          <Form.Item name="name" label={<span>Full Name <span className="text-rose-500">*</span></span>} rules={[{ required: true }]}><Input placeholder="John Doe" size="large" className="rounded-xl" /></Form.Item>
          <Form.Item name="email" label={<span>Email Address <span className="text-rose-500">*</span></span>} rules={[{ required: true, type: 'email' }]}><Input placeholder="name@example.com" size="large" className="rounded-xl" /></Form.Item>
          <Form.Item name="experience" label={<span>Years of Experience <span className="text-rose-500">*</span></span>} rules={[{ required: true }]}><Input placeholder="e.g. 5 Years" size="large" className="rounded-xl" /></Form.Item>
          <div className="flex gap-4 mt-8">
            <Button size="large" block onClick={() => setIsApplyVisible(false)} className="rounded-xl">Cancel</Button>
            <Button type="primary" size="large" block htmlType="submit" className="rounded-xl bg-blue-600 border-0 h-12">Submit Application</Button>
          </div>
        </Form>
      </Modal>

      {/* Post/Edit Job Modal */}
      <Modal
        title={<span className="text-xl font-bold text-blue-600">{editingJob ? 'Edit Job Posting' : 'Post a New Job'}</span>}
        open={isPostVisible}
        onCancel={() => setIsPostVisible(false)}
        footer={null}
        destroyOnHidden
        className="rounded-2xl"
      >
        <Form form={postForm} layout="vertical" onFinish={onPostFinish} className="mt-6" requiredMark={false}>
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
            <Button size="large" block onClick={() => setIsPostVisible(false)} className="rounded-xl">Cancel</Button>
            <Button type="primary" size="large" block htmlType="submit" icon={editingJob ? <EditOutlined /> : <SendOutlined />} className="rounded-xl bg-blue-600 border-0 h-12 font-bold">
              {editingJob ? 'Update Listing' : 'Post Listing'}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
});

export default JobModal;
