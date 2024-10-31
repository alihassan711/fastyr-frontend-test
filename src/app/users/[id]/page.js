"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; 
import UserModal from "@/components/Modals/UserModal";
import { toast } from "react-toastify";

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      username
      email
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String!, $username: String!, $email: String!) {
    updateUser(id: $id, input: { name: $name, username: $username, email: $email }) {
      id
      name
      email
      username
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

const UserDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_USER, { variables: { id } });
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);
  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteUser = async () => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser({ variables: { id } });
        toast.success("User deleted successfully!");
        router.push("/users"); 
      } catch (err) {
        toast.error("Failed to delete user.");
      }
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      await updateUser({ variables: { id, ...userData } });
      toast.success("User updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update user.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-8 lg:pl-20 mt-16">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">User Details</h2>
        <div className="mb-4">
          <strong>Name:</strong> {data.user.name}
        </div>
        <div className="mb-4">
          <strong>Username:</strong> {data.user.username}
        </div>
        <div className="mb-4">
          <strong>Email:</strong> {data.user.email}
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setIsEditing(true)} variant="outline" className="mr-2">
            Edit User
          </Button>
          <Button onClick={handleDeleteUser} variant="destructive">
            Delete User
          </Button>
        </div>
      </Card>
      <UserModal 
        isOpen={isEditing} 
        onClose={() => setIsEditing(false)} 
        onCreateUser={handleUpdateUser} 
        selectedUser={data.user} 
      />
    </div>
  );
};

export default UserDetailPage;
