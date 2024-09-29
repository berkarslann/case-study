import React from "react";
import { Table, Button } from "antd";

interface User {
  id: number;
  name: string;
  email: string;
  surname: string;
  phone?: string;
  age?: number;
  country?: string;
  district?: string;
  role?: string;
}

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, loading, onEdit }) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Button type="link" onClick={() => onEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return <Table dataSource={users} columns={columns} rowKey="id" loading={loading} pagination={false} />;
};

export default UserTable;
