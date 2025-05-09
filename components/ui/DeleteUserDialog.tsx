
"use client"

import React from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Loader2, Trash, AlertTriangle } from 'lucide-react';
import {useDeleteUser, User} from "@/lib/hook/useUsers";

interface DeleteUserDialogProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({ user, isOpen, onClose }) => {
    const deleteUser = useDeleteUser();

    const handleDelete = async () => {
        if (!user) return;

        try {
            await deleteUser.mutateAsync(user.id);
            onClose();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-red-600">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Delete User
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        Are you sure you want to delete this user? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="bg-red-50 border border-red-100 rounded-md p-4">
                        <h3 className="font-medium text-gray-900">User details:</h3>
                        <p className="mt-1 text-sm text-gray-600">Name: {user.name || 'Not provided'}</p>
                        <p className="mt-1 text-sm text-gray-600">Email: {user.email}</p>
                        <p className="mt-1 text-sm text-gray-600">Provider: {user.provider}</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="mr-2">
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="solid"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleDelete}
                        disabled={deleteUser.isPending}>
                        {deleteUser.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete User
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteUserDialog;