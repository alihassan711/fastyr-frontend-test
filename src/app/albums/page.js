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
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AlbumModal from "@/components/Modals/AlbumModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

const GET_ALBUMS = gql`
  query {
    albums {
      data {
        id
        title
        user {
          name
        }
      }
    }
  }
`;

const CREATE_ALBUM = gql`
  mutation CreateAlbum($title: String!, $userId: ID!) {
    createAlbum(input: { title: $title, userId: $userId }) {
      id
      title
    }
  }
`;

const DELETE_ALBUM = gql`
  mutation DeleteAlbum($id: ID!) {
    deleteAlbum(id: $id)
  }
`;

const AlbumsPage = () => {
  const router = useRouter();
  const { loading, error, data, refetch } = useQuery(GET_ALBUMS);
  const [createAlbum] = useMutation(CREATE_ALBUM);
  const [deleteAlbum] = useMutation(DELETE_ALBUM);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

  const handleCreateAlbum = () => {
    setSelectedAlbum(null);
    setIsCreating(true);
  };

  const closeModal = () => {
    setIsCreating(false);
    setSelectedAlbum(null);
    refetch();
  };

  const handleDeleteAlbum = async (id) => {
    if (confirm("Are you sure you want to delete this album?")) {
      try {
        await deleteAlbum({ variables: { id } });
        toast.success("Album deleted successfully!");
        refetch();
      } catch (err) {
        toast.error("Failed to delete album.");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (confirm("Are you sure you want to delete the selected albums?")) {
      try {
        await Promise.all(
          selectedAlbumIds.map((id) => deleteAlbum({ variables: { id } }))
        );
        toast.success("Selected albums deleted successfully!");
        setSelectedAlbumIds([]);
        refetch();
      } catch (err) {
        toast.error("Failed to delete selected albums.");
      }
    }
  };

  const toggleAlbumSelection = (id) => {
    setSelectedAlbumIds((prev) =>
      prev.includes(id) ? prev.filter((albumId) => albumId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAlbumIds.length === data.albums.data.length) {
      setSelectedAlbumIds([]);
    } else {
      setSelectedAlbumIds(data.albums.data.map((album) => album.id));
    }
  };

  const handleViewAlbum = (id) => {
    router.push(`/albums/${id}`);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const albums = XLSX.utils.sheet_to_json(firstSheet);
      validateAndSetAlbums(albums);
    };
    reader.readAsArrayBuffer(file);
  };

  const validateAndSetAlbums = (albums) => {
    const hasTitleColumn = albums.some((album) => "title" in album);
    const hasUserIdColumn = albums.some((album) => "userId" in album);
    if (!hasTitleColumn || !hasUserIdColumn) {
      toast.error(
        "Error: The uploaded file must contain both 'title' and 'userId' columns."
      );
      return;
    }
  
    albums.forEach((album) => {
      if (album.title && album.userId && typeof album.userId === "number") {
        createAlbum({
          variables: { title: album.title, userId: album.userId },
        });
      } else if (album.userId && typeof album.userId !== "number") {
        toast.error(`Error: 'userId' must be a number for album "${album.title}".`);
      }
    });

    toast.success("Albums imported successfully!");
    refetch();
  };

  const handleEditAlbum = (album) => {
    setSelectedAlbum(album);
    setIsCreating(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-8 lg:pl-20 mt-16">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-md sm:text-lg lg:text-2xl font-bold">Album Management</h1>
        <div>
          <label className="inline-flex items-center font-semibold px-4 py-[6px] shadow rounded-md text-gray-700 bg-white hover:bg-green-900 hover:text-white cursor-pointer transition duration-200">
            Import Albums
            <input
              type="file"
              accept=".csv, .xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <Button
            onClick={handleCreateAlbum}
            variant="primary"
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ml-2"
          >
            Create Album
          </Button>
          {selectedAlbumIds?.length > 0 && (
            <Button
              onClick={handleBulkDelete}
              variant="destructive"
              className="ml-2"
            >
              Delete Selected
            </Button>
          )}
        </div>
      </div>
      {errorMessages.length > 0 && (
        <div className="text-red-500 mb-4">
          {errorMessages.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                className="w-4 h-4"
                onChange={toggleSelectAll}
                checked={selectedAlbumIds.length === data.albums.data.length}
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.albums.data.map((album) => (
            <TableRow key={album.id}>
              <TableCell>
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={selectedAlbumIds.includes(album.id)}
                  onChange={() => toggleAlbumSelection(album.id)}
                />
              </TableCell>
              <TableCell>{album.id}</TableCell>
              <TableCell>{album.title}</TableCell>
              <TableCell>{album.user.name}</TableCell>
              <TableCell>
                <div className="flex flex-col md:flex-row md:space-x-2">
                  <Button
                    onClick={() => handleViewAlbum(album.id)}
                    variant="outline"
                    className="mb-2 md:mb-0"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleEditAlbum(album)}
                    variant="outline"
                    className="mb-2 md:mb-0"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteAlbum(album.id)}
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
      <AlbumModal
        isOpen={isCreating}
        onClose={closeModal}
        selectedAlbum={selectedAlbum}
        createAlbum={createAlbum}
      />
    </div>
  );
};

export default AlbumsPage;
