import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import {
  Upload,
  X,
  Trash2,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Filter,
  Grid,
  List,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import React from "react";

interface Image {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  createdAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const Gallery = () => {
  const { user, isPremium } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedImageId = searchParams.get("selected");

  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 12,
    pages: 0,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<Image | null>(null);

  // Fetch images
  const fetchImages = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const { data } = await api.get(
          `/api/images?page=${page}&limit=${pagination.limit}`
        );
        setImages(data.images);
        setPagination(data.pagination);

        // If a selected image ID is in the URL, select that image
        if (selectedImageId) {
          const selected = data.images.find(
            (img: Image) => img.id === selectedImageId
          );
          if (selected) {
            setSelectedImage(selected);
          }
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        toast.error("Failed to load images");
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.limit, selectedImageId]
  );

  // Initial load
  useEffect(() => {
    fetchImages(1);
  }, [fetchImages]);

  // Handle file upload
  // const onDrop = useCallback(async (acceptedFiles: File[]) => {
  //   if (!acceptedFiles.length) return;

  //   setIsUploading(true);
  //   setUploadProgress(0);

  //   const formData = new FormData();
  //   formData.append('image', acceptedFiles[0]);

  //   try {
  //     const { data } = await api.post('/api/images/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       onUploadProgress: (progressEvent) => {
  //         if (progressEvent.total) {
  //           const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  //           setUploadProgress(percentCompleted);
  //         }
  //       },
  //     });

  //     toast.success('Image uploaded successfully');

  //     // Refetch the first page to show the new image
  //     await fetchImages(1);

  //     // Select the newly uploaded image
  //     setSelectedImage(data.image);
  //     setSearchParams({ selected: data.image.id });
  //   } catch (error: any) {
  //     console.error('Upload error:', error);

  //     if (error.response?.data?.isPremiumRequired) {
  //       toast.error('You\'ve reached the upload limit. Upgrade to premium for unlimited uploads.');
  //     } else {
  //       toast.error('Failed to upload image');
  //     }
  //   } finally {
  //     setIsUploading(false);
  //   }
  // }, [fetchImages, setSearchParams]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();

      // Append all accepted files
      acceptedFiles.forEach((file) => {
        formData.append("images", file); // assume your backend accepts 'images' as multiple files, not 'image'
      });

      try {
        const { data } = await api.post("/api/images/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          },
        });

        toast.success(`${data.images.length} images uploaded successfully`); // assuming backend returns data.images array

        // Refetch the first page to show the new images
        await fetchImages(1);

        // Select the first uploaded image or keep the currently selected unchanged
        if (data.images.length > 0) {
          setSelectedImage(data.images[0]);
          setSearchParams({ selected: data.images[0].id });
        }
      } catch (error: any) {
        console.error("Upload error:", error);

        if (error.response?.data?.isPremiumRequired) {
          toast.error(
            "You've reached the upload limit. Upgrade to premium for unlimited uploads."
          );
        } else {
          toast.error("Failed to upload images");
        }
      } finally {
        setIsUploading(false);
      }
    },
    [fetchImages, setSearchParams]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
    disabled: isUploading,
  });

  // Select an image
  const handleSelectImage = (image: Image) => {
    setSelectedImage(image);
    setSearchParams({ selected: image.id });
  };

  // Close image details
  const handleCloseDetails = () => {
    setSelectedImage(null);
    setSearchParams({});
  };

  // Copy image URL
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  // Open image in new tab
  const handleOpenImage = (url: string) => {
    window.open(url, "_blank");
  };

  // Delete confirmation
  const handleDeleteConfirm = (image: Image) => {
    setImageToDelete(image);
    setIsDeleteModalOpen(true);
  };

  // Delete image
  const handleDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      await api.delete(`/api/images/${imageToDelete.id}`);
      toast.success("Image deleted successfully");

      // Close the modal and details if the deleted image was selected
      setIsDeleteModalOpen(false);
      if (selectedImage?.id === imageToDelete.id) {
        setSelectedImage(null);
        setSearchParams({});
      }

      // Refresh the gallery
      await fetchImages(pagination.page);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    }
  };

  // Pagination
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchImages(newPage);
  };

  // Format size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Free plan limits warning
  const showUploadLimitWarning =
    !isPremium && user?.uploadStats?.remaining === 0;

  return (
    <div className="fade-in">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Image Gallery
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Upload, view and manage your images
          </p>
        </div>

        {!isPremium && user?.uploadStats && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-md px-4 py-2 text-sm">
            <p className="font-medium text-gray-700 dark:text-gray-300">
              {user.uploadStats.used} / {user.uploadStats.total} images used
            </p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 dark:bg-gray-700">
              <div
                className="h-1.5 bg-indigo-600 rounded-full dark:bg-indigo-500"
                style={{
                  width: `${
                    (user.uploadStats.used / user.uploadStats.total) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - upload and gallery */}
        <div className="lg:col-span-2">
          {/* Upload area */}
          <div className="mb-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragActive
                  ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20"
                  : "border-gray-300 dark:border-gray-700"
              } ${
                showUploadLimitWarning
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <input {...getInputProps()} disabled={showUploadLimitWarning} />
              {isUploading ? (
                <div className="py-4">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Uploading... {uploadProgress}%
                  </p>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2 dark:bg-gray-700">
                    <div
                      className="h-2 bg-indigo-600 rounded-full transition-all duration-300 dark:bg-indigo-500"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-300 mb-1">
                    {isDragActive
                      ? "Drop your image here"
                      : "Drag & drop an image here, or click to select"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Max file size: 5MB. Supported formats: JPEG, PNG, GIF, WebP
                  </p>
                  {showUploadLimitWarning && (
                    <div className="mt-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md">
                      You've reached your upload limit.{" "}
                      <a href="/upgrade" className="font-medium underline">
                        Upgrade to Premium
                      </a>{" "}
                      for unlimited uploads.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Gallery controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search images..."
                className="pl-9 input w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  title="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <button
                className="p-2 text-gray-500 dark:text-gray-400"
                title="Filter"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Gallery */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : images.length > 0 ? (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className={`card overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                        selectedImage?.id === image.id
                          ? "ring-2 ring-indigo-500 dark:ring-indigo-400"
                          : ""
                      }`}
                      onClick={() => handleSelectImage(image)}
                    >
                      <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative">
                        <img
                          src={image.url}
                          alt={image.originalName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <p
                          className="text-xs text-gray-500 dark:text-gray-400 truncate"
                          title={image.originalName}
                        >
                          {image.originalName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card divide-y divide-gray-200 dark:divide-gray-700">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        selectedImage?.id === image.id
                          ? "bg-indigo-50 dark:bg-indigo-900/20"
                          : ""
                      }`}
                      onClick={() => handleSelectImage(image)}
                    >
                      <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden mr-3 flex-shrink-0">
                        <img
                          src={image.url}
                          alt={image.originalName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {image.originalName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatSize(image.size)} •{" "}
                          {formatDate(image.createdAt)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConfirm(image);
                          }}
                          className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} images
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first, last, current, and pages around current
                        return (
                          page === 1 ||
                          page === pagination.pages ||
                          Math.abs(page - pagination.page) <= 1
                        );
                      })
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="text-gray-400 dark:text-gray-500">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 rounded-md text-sm ${
                              pagination.page === page
                                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                                : "border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="p-2 rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg dark:bg-gray-800">
              <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No images yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Upload your first image to get started
              </p>
            </div>
          )}
        </div>

        {/* Right column - image details */}
        <div>
          {selectedImage ? (
            <div className="card p-4 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                  {selectedImage.originalName}
                </h3>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-md mb-4 overflow-hidden">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.originalName}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={selectedImage.url}
                      readOnly
                      className="input rounded-r-none flex-1 text-sm"
                    />
                    <button
                      onClick={() => handleCopyUrl(selectedImage.url)}
                      className="bg-gray-100 border border-l-0 border-gray-300 px-3 rounded-r-md hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                      title="Copy URL"
                    >
                      <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      File size
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatSize(selectedImage.size)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Uploaded
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatDate(selectedImage.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleDeleteConfirm(selectedImage)}
                    className="btn btn-outline text-red-600 hover:bg-red-4  00 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 mr-2"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                  <button
                    onClick={() => handleOpenImage(selectedImage.url)}
                    className="btn btn-outline flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No image selected
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Select an image to view its details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete Image
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{imageToDelete?.originalName}"?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button onClick={handleDeleteImage} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
