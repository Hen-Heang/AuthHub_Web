"use client";

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import {useUsers} from "@/lib/hook/useUsers";
import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";

const UserList = () => {
    const {data: users, isLoading, error} = useUsers();

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
        <div>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">User Management</h2>
                    <Badge className="bg-indigo-600">{users.length} Users</Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
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
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserList;