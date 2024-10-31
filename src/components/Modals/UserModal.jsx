"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, gql } from "@apollo/client";
import { toast } from "react-toastify";

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $username: String!, $email: String!) {
    createUser(input: { name: $name, username: $username, email: $email }) {
      id
      name
      email
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $name: String!
    $email: String!
  ) {
    updateUser(
      id: $id
      input: { name: $name, email: $email }
    ) {
      id
      name
      email
    }
  }
`;


const UserModal = ({ isOpen, onClose, selectedUser }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setUsername(selectedUser.username);
      setEmail(selectedUser.email);
    } else {
      setName("");
      setUsername("");
      setEmail("");
    }
  }, [selectedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedUser && (!name || !email)) {
        toast.error("All fields are required for User Creation.");
        return;
      }

    if (!selectedUser && (!name || !username || !email)) {
      toast.error("All fields are required for User Creation.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      if (selectedUser) {
        await updateUser({
          variables: { id: selectedUser.id, name, email },
        });
        toast.success("User updated successfully!");
      } else {
        await createUser({
          variables: { name, username, email },
        });
        toast.success("User created successfully!");
      }
      onClose(); 
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {selectedUser ? "Edit User" : "Create User"}
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4"
          />
          {!selectedUser && (
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4"
            />
          )}
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-end">
            <Button type="submit" variant="primary" className="mr-2">
              {selectedUser ? "Update" : "Create"}
            </Button>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
