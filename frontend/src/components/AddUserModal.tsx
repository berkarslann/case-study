import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

interface AddUserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (user: any) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ visible, onCancel, onSave }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); 
      onSave(values); 
      form.resetFields(); 
    } catch (error) {
      console.error('Validation Failed:', error); 
    }
  };
  
  return (
    <Modal
      title="Add New User"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields(); 
        onCancel();
      }}
    >
      <Form form={form} layout="vertical" name="addUserForm">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input the name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="surname"
          label="Surname"
          rules={[{ required: true, message: 'Please input the surname!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input the email!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input the password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
        <Form.Item name="age" label="Age">
          <Input type="number" />
        </Form.Item>
        <Form.Item name="country" label="Country">
          <Input />
        </Form.Item>
        <Form.Item name="district" label="District">
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Role">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
