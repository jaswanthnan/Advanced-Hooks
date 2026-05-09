import React, { useRef } from 'react';
import { Card, Tag, Typography, Button, Space, Tooltip } from 'antd';
import { EnvironmentOutlined, SendOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useIntersectionObserver } from '../../hooks';
import { Job } from '../../types';

const { Title, Text } = Typography;

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  onEdit?: (job: Job) => void;
  onDelete?: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, onEdit, onDelete }) => {
  console.log(`%c [React.memo] Rendering JobCard: ${job.title} `, 'color: #10b981; font-style: italic;');
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 });

  return (
    <div 
      ref={cardRef} 
      className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <Card 
        className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-all h-full dark:bg-slate-800"
        styles={{ body: { padding: '24px' } }}
      >
        <div className="flex justify-between items-start mb-4">
          <Tag color="blue" className="rounded-full px-3">{job.type}</Tag>
          <div className="flex items-center gap-2">
            <Text className="text-slate-400 text-xs">{job.department}</Text>
            {onEdit && onDelete && (
              <Space size="small">
                <Tooltip title="Edit Job">
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<EditOutlined className="text-blue-500" />} 
                    onClick={() => onEdit(job)}
                  />
                </Tooltip>
                <Tooltip title="Delete Job">
                  <Button 
                    type="text" 
                    size="small" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => onDelete(job._id)}
                  />
                </Tooltip>
              </Space>
            )}
          </div>
        </div>
        
        <Title level={4} className="mb-2 dark:text-white">{job.title}</Title>
        <div className="flex items-center text-slate-500 mb-6">
          <EnvironmentOutlined className="mr-2 text-rose-500" />
          <span>{job.location}</span>
        </div>

        <div className="flex gap-3">
          <Button 
            type="primary" 
            icon={<SendOutlined />} 
            block 
            className="h-10 rounded-xl bg-blue-600 border-0"
            onClick={() => onApply(job)}
          >
            Apply Now
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default React.memo(JobCard);
