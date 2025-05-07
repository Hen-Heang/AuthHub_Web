import React from 'react';
import {useComments, usePosts, useUsers} from "@/lib/hook";
import Loading from "@/components/ui/Loading";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {formatDate} from "@/lib/utils";

const PostDetail = () => {
    const {data: post,isLoading :isLoadingPosts, error,postError} = usePosts();
    const {data: comments, isLoading: isLoadingComments} = useComments();
    const {data: users, isLoading: isLoadingUsers} = useUsers();
    if (isLoadingComments || isLoadingPosts || isLoadingUsers) {
        return <Loading />;
    }

    if (postError || !post) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">Error loading post. The post may have been deleted or is unavailable.</p>
                <Link href="/dashboard">
                    <Button className="mt-4">Return to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{post.tiltle}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>By {users?.name || 'Unknown Author'}</span>
                        {/* Using a fake date since JSONPlaceholder doesn't provide dates */}
                        <span>•</span>
                        <span>{formatDate(new Date())}</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="prose max-w-none">
                        <p>{post.body}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                    <Link href="/dashboard">
                        <Button variant="outline">Back to Posts</Button>
                    </Link>
                    <div className="flex gap-2">
                        <Link href={`/edit-post/${post.id}`}>
                            <Button>Edit Post</Button>
                        </Link>
                    </div>
                </CardFooter>
            </Card>

            <div className="space-y-4">
                <h2 className="text-xl font-bold">Comments ({comments?.length || 0})</h2>

                {comments && comments.length > 0 ? (
                    <div className="space-y-4">
                        {comments.map(comment => (
                            <Card key={comment.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{comment.name}</span>
                                        <span className="text-sm text-gray-500">{comment.email}</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p>{comment.body}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-4 text-center text-gray-500">
                            No comments yet
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default PostDetail;