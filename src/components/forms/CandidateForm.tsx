import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select, Button, Space, Typography, Alert, Form as AntForm } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { candidateSchema, CandidateFormValues } from '../../schemas/candidateSchema';
import { Candidate } from '../../types';

interface CandidateFormProps {
  initialValues?: Candidate | null;
  candidates: Candidate[];
  onSubmit: (values: CandidateFormValues) => Promise<void>;
  onCancel: () => void;
}



export const CandidateForm: React.FC<CandidateFormProps> = ({ initialValues, candidates, onSubmit, onCancel }) => {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: CandidateFormValues = initialValues ? {
    name: initialValues.name,
    email: initialValues.email,
    role: initialValues.role,
    experience: initialValues.experience,
    status: initialValues.status as any,
    skills: initialValues.skills?.map(s => ({ name: s })) || [{ name: '' }],
  } : {
    name: '',
    email: '',
    role: '',
    experience: '',
    status: 'Pending',
    skills: [{ name: '' }],
  };

  const { control, handleSubmit, setError, reset, formState: { errors } } = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [initialValues, reset]);

  const handleFormSubmit = async (data: CandidateFormValues) => {
    console.log("FORM DATA:", data);

    const emailAlreadyExists = candidates.some(
      (candidate) => candidate.email === data.email && candidate._id !== initialValues?._id
    );

    if (emailAlreadyExists) {
      console.log("SERVER ERROR: Email already exists");

      setError("email", {
        type: "server",
        message: "This email already exists",
      });

      return;
    }

    console.log("SUCCESS:", data);

    setIsSubmitting(true);
    try {
      // Submit
      await onSubmit(data);
    } catch (error: any) {
      // Server Error Mapping
      setError('root.serverError', {
        type: 'server',
        message: error?.response?.data?.message || error.message || 'An unexpected server error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AntForm layout="vertical" onFinish={handleSubmit(handleFormSubmit)} requiredMark={false}>
      {errors.root?.serverError && (
        <Alert
          message="Submission Error"
          description={errors.root.serverError.message}
          type="error"
          showIcon
          className="mb-4 rounded-xl"
        />
      )}

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <AntForm.Item
            label={<span>Full Name <span className="text-rose-500">*</span></span>}
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name?.message}
          >
            <Input {...field} placeholder="John Smith" size="large" className="rounded-xl" />
          </AntForm.Item>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <AntForm.Item
            label={<span>Email Address <span className="text-rose-500">*</span></span>}
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Input {...field} placeholder="john@example.com" size="large" className="rounded-xl" />
          </AntForm.Item>
        )}
      />

      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <AntForm.Item
            label={<span>Position <span className="text-rose-500">*</span></span>}
            validateStatus={errors.role ? 'error' : ''}
            help={errors.role?.message}
          >
            <Input {...field} placeholder="Senior UI Designer" size="large" className="rounded-xl" />
          </AntForm.Item>
        )}
      />

      <Controller
        name="experience"
        control={control}
        render={({ field }) => (
          <AntForm.Item
            label={<span>Years of Experience <span className="text-rose-500">*</span></span>}
            validateStatus={errors.experience ? 'error' : ''}
            help={errors.experience?.message}
          >
            <Input {...field} placeholder="e.g. 5 Years" size="large" className="rounded-xl" />
          </AntForm.Item>
        )}
      />

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <AntForm.Item
            label={<span>Current Status <span className="text-rose-500">*</span></span>}
            validateStatus={errors.status ? 'error' : ''}
            help={errors.status?.message}
          >
            <Select {...field} placeholder="Select status" size="large" className="rounded-xl">
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="In Review">In Review</Select.Option>
              <Select.Option value="Hired">Hired</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
            </Select>
          </AntForm.Item>
        )}
      />

      <div className="mb-4">
        <Typography.Text strong className="block mb-2">Skills</Typography.Text>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2 items-start">
            <Controller
              name={`skills.${index}.name`}
              control={control}
              render={({ field: inputField }) => (
                <AntForm.Item
                  className="flex-1 mb-0"
                  validateStatus={errors.skills?.[index]?.name ? 'error' : ''}
                  help={errors.skills?.[index]?.name?.message}
                >
                  <Input {...inputField} placeholder="e.g. React" size="large" className="rounded-xl" />
                </AntForm.Item>
              )}
            />
            <Button
              type="text"
              danger
              icon={<MinusCircleOutlined />}
              onClick={() => remove(index)}
              className="mt-1"
            />
          </div>
        ))}
        <Button
          type="dashed"
          onClick={() => append({ name: '' })}
          block
          icon={<PlusOutlined />}
          className="rounded-xl mt-2"
        >
          Add Skill
        </Button>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button onClick={onCancel} size="large" className="rounded-xl">
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={isSubmitting} size="large" className="rounded-xl bg-blue-600">
          Save Candidate
        </Button>
      </div>
    </AntForm>
  );
};
