"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, gql } from "@apollo/client";
import { toast } from "react-toastify";

const CREATE_ALBUM = gql`
  mutation CreateAlbum($title: String!, $userId: ID!) {
    createAlbum(input: { title: $title, userId: $userId }) {
      id
      title
    }
  }
`;

const UPDATE_ALBUM = gql`
  mutation UpdateAlbum($id: ID!, $title: String!) {
    updateAlbum(id: $id, input: { title: $title }) {
      title
    }
  }
`;

const AlbumModal = ({ isOpen, onClose, selectedAlbum }) => {
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [createAlbum] = useMutation(CREATE_ALBUM);
  const [updateAlbum] = useMutation(UPDATE_ALBUM);

  useEffect(() => {
    if (selectedAlbum) {
        console.log('selectedAlbum', selectedAlbum)
      setTitle(selectedAlbum.title);
      setUserId(selectedAlbum.userId);
    } else {
      setTitle("");
      setUserId("");
    }
  }, [selectedAlbum]);

  console.log('selectedAlbum', selectedAlbum)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAlbum && (!title || !userId)) {
      toast.error("All fields are required.");
      return;
    }

    if (selectedAlbum && (!title)) {
        toast.error("Title is required.");
        return;
      }

    try {
      if (selectedAlbum) {
        await updateAlbum({
          variables: { id: selectedAlbum.id, title, userId },
        });
        toast.success("Album updated successfully!");
      } else {
        await createAlbum({
          variables: { title, userId },
        });
        toast.success("Album created successfully!");
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
          {selectedAlbum ? "Edit Album" : "Create Album"}
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Album Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4"
          />
          {!selectedAlbum && 
            <Input
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mb-4"
            />
          }
          <div className="flex justify-end">
            <Button type="submit" variant="primary" className="mr-2">
              {selectedAlbum ? "Update" : "Create"}
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

export default AlbumModal;
