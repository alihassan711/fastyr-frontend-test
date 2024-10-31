"use client";
import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import UserModal from "../../components/Modals/UserModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const GET_USERS = gql`
  query {
    users {
      data {
        id
        name
        email
      }
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

const Users = () => {
  const router = useRouter();
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [deleteUser] = useMutation(DELETE_USER);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsCreating(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsCreating(true);
  };

  const closeModal = () => {
    setIsCreating(false);
    setSelectedUser(null);
    refetch();
  };

  const handleDeleteUser = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        console.log("Deleting user with id:", id);
        const { data } = await deleteUser({ variables: { id } });

        if (data.deleteUser) {
          toast.success("User deleted successfully!");
        } else {
          toast.error("Failed to delete user.");
        }
        refetch(); 
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("An error occurred while deleting the user.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-8 lg:pl-20 mt-16">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button
          onClick={handleCreateUser}
          variant="primary"
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
          Create User
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.users?.data?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex flex-col md:flex-row md:space-x-2">
                  <Button
                    onClick={() => router.push(`/users/${user.id}`)}
                    variant="outline"
                    className="mb-2 md:mb-0"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleEditUser(user)}
                    variant="outline"
                    className="mb-2 md:mb-0"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteUser(user.id)}
                    variant="destructive"
                    className="md:ml-2"
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UserModal
        isOpen={isCreating}
        onClose={closeModal}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default Users;
