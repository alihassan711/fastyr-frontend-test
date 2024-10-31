"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; 
import AlbumModal from "@/components/Modals/AlbumModal"; 
import { toast } from "react-toastify";

const GET_ALBUM = gql`
  query GetAlbum($id: ID!) {
    album(id: $id) {
      id
      title
      user {
        name
      }
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

const DELETE_ALBUM = gql`
  mutation DeleteAlbum($id: ID!) {
    deleteAlbum(id: $id)
  }
`;

const AlbumDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_ALBUM, { variables: { id } });
  const [updateAlbum] = useMutation(UPDATE_ALBUM);
  const [deleteAlbum] = useMutation(DELETE_ALBUM);
  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteAlbum = async () => {
    if (confirm("Are you sure you want to delete this album?")) {
      try {
        await deleteAlbum({ variables: { id } });
        toast.success("Album deleted successfully!");
        router.push("/albums"); 
      } catch (err) {
        toast.error("Failed to delete album.");
      }
    }
  };

  const handleUpdateAlbum = async (albumData) => {
    try {
      await updateAlbum({ variables: { id, ...albumData } });
      toast.success("Album updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update album.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-8 lg:pl-20 mt-16">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Album Details</h2>
        <div className="mb-4">
          <strong>Title:</strong> {data.album.title}
        </div>
        <div className="mb-4">
          <strong>User:</strong> {data.album.user.name}
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setIsEditing(true)} variant="outline" className="mr-2">
            Edit Album
          </Button>
          <Button onClick={handleDeleteAlbum} variant="destructive">
            Delete Album
          </Button>
        </div>
      </Card>
      <AlbumModal 
        isOpen={isEditing} 
        onClose={() => setIsEditing(false)} 
        onCreateAlbum={handleUpdateAlbum} 
        selectedAlbum={data.album} 
      />
    </div>
  );
};

export default AlbumDetailPage;
