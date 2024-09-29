import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

interface EditUserModalProps {
  visible: boolean;
  user: any;
  onCancel: () => void;
  onSave: (updatedUser: any) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ visible, user, onCancel, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
   
    form.setFieldsValue(user);
  }, [user, form]);

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
      title="Edit User"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields(); 
        onCancel();
      }}
    >
      <Form form={form} layout="vertical" name="userForm">
        <Form.Item name="id" label="User ID" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="surname" label="Surname" rules={[{ required: true, message: 'Please input the surname!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the email!' }]}>
          <Input />
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

export default EditUserModal;
