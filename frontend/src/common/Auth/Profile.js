import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Avatar, Descriptions, Button, Modal, Form, Input, message } from "antd";
import { UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Layout from "../../Layout";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const Profile = () => {
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    email: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  // State for delete confirmation modal
  const [form] = Form.useForm();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: token },
        });
        setProfile(res.data);
        form.setFieldsValue(res.data); // Set form values when data is fetched
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [token, form]);

  const handleSubmit = async (values) => {
    try {
      const res = await axios.put("http://localhost:5000/api/user/profile", values, {
        headers: { Authorization: token },
      });
      setProfile(values);
      message.success(res.data.message);
      setIsModalOpen(false);
      window.location.reload(); // Refresh the page after updating profile

    } catch (error) {
      message.error("Error updating profile");
    }
  };

  const handleRemoveUser = async () => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/user/remove/${profile._id}`, {
        headers: { Authorization: token },
      });
      message.success(res.data.message);

      // Logout the user by removing tokens from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userAddress');
      localStorage.removeItem('userPhone');

      // Navigate to the login page after logout
      navigate("/");
    } catch (error) {
      message.error("Error removing user");
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <Layout>
      <Card style={{ maxWidth: 500, margin: "auto", marginTop: 50, textAlign: "center" }}>
        <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: "yellow", marginBottom: 20 }} />
        <Descriptions title="User Profile" bordered column={1} style={{ textAlign: "left" }}>
          <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
          <Descriptions.Item label="First Name">{profile.firstname || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{profile.lastname || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Address">{profile.address || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Phone">{profile.phone || "N/A"}</Descriptions.Item>
        </Descriptions>
        <Button type="primary" icon={<EditOutlined />} onClick={() => setIsModalOpen(true)} style={{ marginTop: 20 }}>
          Edit Profile
        </Button>
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() => setIsDeleteModalOpen(true)}
          style={{ marginTop: 10, marginLeft: 10 }}
        >
          Remove User
        </Button>
      </Card>

      {/* Modal for Editing Profile */}
      <Modal title="Edit Profile" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="First Name"
            name="firstname"
            rules={[
              { required: true, message: "First name is required" },
              { pattern: /^[A-Za-z]+$/, message: "Only alphabets allowed" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastname"
            rules={[
              { required: true, message: "Last name is required" },
              { pattern: /^[A-Za-z]+$/, message: "Only alphabets allowed" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Address is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Phone number is required" },
              { pattern: /^[0-9]{10}$/, message: "Must be a valid 10-digit number" },
            ]}
          >
            <Input maxLength={10} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Confirming User Deletion */}
      <Modal
        title="Are you sure?"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={handleRemoveUser}
        okText="Yes, remove"
        cancelText="Cancel"
      >
        <p>Are you sure you want to remove your account? This action cannot be undone.</p>
      </Modal>
    </Layout>
  );
};

export default Profile;
