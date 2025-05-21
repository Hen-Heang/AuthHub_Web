"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User as UserIcon, Mail, Shield, CheckCircle, AlertCircle, Loader2, Pencil, Trash } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import EditUserForm from './ui/EditUserForm';
import {User} from "@/lib/hook/useUsers";
import {useUsers} from "@/lib/hook/useUsers";
import DeleteUserDialog from "@/components/ui/DeleteUserDialog";




const UserList = () => {
    const { data: users, isLoading, error } = useUsers();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    type LocalUser = User & { id: number };  // Ensure id is required
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleEditUser = (user: LocalUser) => {
        setSelectedUser(user);
        setIsEditDialogOpen(true);
    };

    const handleDeleteUser = (user: LocalUser) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <span className="ml-2">Loading users...</span>
            </div>
        );
    }

    if (error || !users) {
        return (
            <div className="flex items-center justify-center p-8 text-red-500">
                <AlertCircle className="h-6 w-6 mr-2" />
                <span>Error loading users. Please try again later.</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">User Management</h2>
                <Badge className="bg-indigo-600">{users.length} Users</Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {users?.map((user: User) => (
                    <Card key={user.id} className="overflow-hidden border-slate-200">
                        <CardHeader className="bg-slate-50 pb-2">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12 border-2 border-indigo-100">
                                    {user.imageUrl ? (
                                        <AvatarImage src={user.imageUrl} alt={user.name} />
                                    ) : (
                                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                            {getInitials(user.name || user.email)}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div>
                                    <CardTitle className="text-base">{user.name || 'No name provided'}</CardTitle>
                                    <div className="flex items-center mt-1 text-sm text-slate-500">
                                        <Badge variant="outline" className="mr-2 bg-slate-50">
                                            ID: {user.id}
                                        </Badge>
                                        <Badge variant="outline" className={`${
                                            user.provider === 'GOOGLE' ? 'bg-blue-50 text-blue-600' :
                                                user.provider === 'GITHUB' ? 'bg-gray-50 text-gray-800' :
                                                    'bg-indigo-50 text-indigo-600'
                                        }`}>
                                            {user.provider}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                <div className="flex items-center text-sm">
                                    <Mail className="h-4 w-4 mr-2 text-slate-400" />
                                    <span className="text-slate-600">{user.email}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Shield className="h-4 w-4 mr-2 text-slate-400" />
                                    <span className="text-slate-600">User</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    {user.emailVerified ? (
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                                    )}
                                    <span>
                    {user.emailVerified ? 'Email verified' : 'Email not verified'}
                  </span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 p-2 flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                            >
                                <Pencil className="h-3 w-3 mr-1" />
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(user)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <Trash className="h-3 w-3 mr-1" />
                                Delete
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Edit User Dialog */}
            <EditUserForm
                user={selectedUser}
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
            />

             Delete User Dialog
            <DeleteUserDialog
                user={selectedUser}
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
            />
        </div>
    );
};

export default UserList;