"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Save, User as UserIcon } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import {Avatar, AvatarFallback, AvatarImage} from '@radix-ui/react-avatar';
import {useUpdateUser} from "@/lib/hook/useUsers";

const UserProfileForm = () => {
    const {user, fetchCurrentUser } = useAuth()
    const updateUser = useUpdateUser()
    const [isSubmit, setIsSubmit] = useState(false)
    
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                imageUrl: user.imageUrl || '',
            });
        }
    }, [user]);

    const  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user?.id) return;
        try {
            await updateUser.mutateAsync({
                id: user.id,
                updateData: {
                    name: formData.name,
                    email: formData.email,
                    imageUrl: formData.imageUrl,
                },
            });
            setIsSubmit(true);
            setTimeout(() => {
                setIsSubmit(false);
            }, 2000);
            await fetchCurrentUser();
            toast .success('User updated successfully');

        } catch (error) {
            console.error('Error updating user:', error);
        }finally {
            setIsSubmit(false);
        }

    }
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        imageUrl: user?.imageUrl || '',
    })

    // set loading state
    if (!user) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <span className="ml-2">Loading profile...</span>
            </div>
        );
    }



    
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-indigo-100">
                        {user.imageUrl ? (
                            <AvatarImage src={user.imageUrl} alt={user.name} />
                        ) : (
                            <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl">
                                {getInitials(user.name || user.email)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div>
                        <CardTitle>Edit Your Profile</CardTitle>
                        <p className="text-sm text-slate-500 mt-1">Update your personal information</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Your Full Name"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Your Email Address"
                            readOnly={user.provider !== 'LOCAL'} // Only allow editing email for local accounts
                            className={user.provider !== 'LOCAL' ? 'bg-slate-50 cursor-not-allowed' : ''}
                        />
                        {user.provider !== 'LOCAL' && (
                            <p className="text-xs text-slate-500">
                                Email cannot be changed for {user.provider?.toLowerCase() || 'external'} accounts
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Profile Image URL</Label>
                        <Input
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            placeholder="https://example.com/avatar.jpg"
                        />
                        <p className="text-xs text-slate-500">
                            Enter a URL for your profile picture (optional)
                        </p>
                    </div>

                    <CardFooter className="p-0 pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmit || updateUser.isPending}
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                        >
                            {isSubmit || updateUser.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Profile
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
};

export default UserProfileForm;