import React, { useEffect, useState } from "react";
import { Input, Pagination, Button, Space, message } from "antd";
import { getUsers, updateUser, addUser } from "./services/userService";
import UserTable from "./components/UserTable";
import EditUserModal from "./components/EditUserModal";
import AddUserModal from "./components/AddUserModal";
import "./App.css";

interface User {
  id: number;
  name: string;
  email: string;
  surname: string;
  password?: string;
  phone?: string;
  age?: number;
  country?: string;
  district?: string;
  role?: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [isAddModalVisible, setAddModalVisible] = useState<boolean>(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers(page, pageSize, search);
      setUsers(data.data);
      setTotalRows(data.totalRows);
    } catch (error) {
      console.error("Failed at fetching", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, search]);

  const handleEditUser = async (updatedUser: User) => {
    try {
      await updateUser(updatedUser);
      setEditModalVisible(false);
      fetchUsers();
      message.success("User updated successfully!");
    } catch (error) {
      console.error("Failed to update user:", error);
      message.error("Failed to update user. Please try again.");
    }
  };

  const handleAddUser = async (newUser: User) => {
    try {
      await addUser(newUser);
      setAddModalVisible(false);
      fetchUsers();
      message.success("User added successfully!");
    } catch (error) {
      console.error("Failed to add user:", error);
      message.error(
        "Failed to add user. Please check the input fields and try again."
      );
    }
  };

  return (
    <div className="container">
      <h1 className="title">User Management System</h1>

      <Space className="space">
        <Input.Search
          placeholder="Search..."
          onSearch={(value) => setSearch(value)}
          enterButton
          className="search-input"
        />
        <Button
          type="primary"
          onClick={() => setAddModalVisible(true)}
          className="add-button"
        >
          Add User
        </Button>
      </Space>

      <UserTable
        users={users}
        loading={loading}
        onEdit={(user) => {
          setEditingUser(user);
          setEditModalVisible(true);
        }}
      />

      <Pagination
        current={page}
        pageSize={pageSize}
        total={totalRows}
        onChange={(newPage) => setPage(newPage)}
        showSizeChanger
        onShowSizeChange={(current, size) => setPageSize(size)}
        className="pagination"
      />

      <EditUserModal
        visible={isEditModalVisible}
        user={editingUser}
        onCancel={() => setEditModalVisible(false)}
        onSave={handleEditUser}
      />

      <AddUserModal
        visible={isAddModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onSave={handleAddUser}
      />
    </div>
  );
};

export default App;
