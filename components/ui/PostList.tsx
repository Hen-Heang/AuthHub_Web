import React, {useState} from 'react';
import {useDeletePost, usePosts, useUsers} from "@/lib/hook";
import Loading from "@/components/ui/Loading";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {truncateText} from "@/lib/utils";

const PostList = () => {
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Move all hooks to the top level
    const {data: posts, isLoading: isLoadingPosts, error: postsError} = usePosts();
    const {data: users, isLoading: isLoadingUsers} = useUsers();
    const deletePost = useDeletePost();

    const handleGetAuthorName = (userId: number) => {
        if (!users) return '';
        const user = users.find(user => user.id === userId);
        return user ? user.name : '';
    }

    const handlePrevPage = () => {
        setPage(current => Math.max(current - 1, 1));
    };

    const handleNextPage = () => {
        setPage(current => current + 1);
    };

    const handleDeletePost = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            await deletePost.mutateAsync(id);
        }
    }

    // Calculate pagination values after all hooks
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPosts = posts?.slice(startIndex, endIndex);
    const totalPages = Math.ceil((posts?.length || 0) / pageSize);

    if (isLoadingPosts || isLoadingUsers) {
        return <Loading />;
    }

    if (postsError || !posts) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">Error loading posts. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Posts</h2>
                <Link href="/create-post">
                    <Button>Create Post</Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentPosts?.map(post => (
                    <Card key={post.id} className="flex flex-col h-full">
                        <CardHeader>
                            <CardTitle className="line-clamp-2">{post.tiltle}</CardTitle>
                            <CardDescription>
                                By {handleGetAuthorName(post.userId)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-gray-600">{truncateText(post.body, 50)}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                            <Link href={`/posts/${post.id}`}>
                                <Button variant="outline" size="sm">Read more</Button>
                            </Link>
                            <div className="flex gap-2">
                                <Link href={`/edit-post/${post.id}`}>
                                    <Button variant="ghost" size="sm">Edit</Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeletePost(post.id)}
                                    disabled={deletePost.isPending}
                                >
                                    {deletePost.isPending ? 'Deleting...' : 'Delete'}
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="flex justify-between items-center mt-8">
                <Button
                    variant="outline"
                    onClick={handlePrevPage}
                    disabled={page <= 1}
                >
                    Previous
                </Button>
                <span className="text-sm text-gray-500">
                    Page {page} of {totalPages || 1}
                </span>
                <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={page >= totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default PostList;