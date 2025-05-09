"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, X } from 'lucide-react';
import { User } from '@/context/AuthContext';
import { useUpdateUser } from '@/lib/hook/useUsers';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import {Switch} from "@radix-ui/react-switch";



interface EditUserFormProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        imageUrl: '',
        emailVerified: false
    });
    const updateUser = useUpdateUser();

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                imageUrl: user.imageUrl || '',
                emailVerified: user.emailVerified || false
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, emailVerified: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            if (!user.id) return;
            await updateUser.mutateAsync({
                id: user.id,
                updateData: {
                    name: formData.name,
                    email: formData.email,
                    imageUrl: formData.imageUrl || undefined,
                    emailVerified: formData.emailVerified
                }
            });
            onClose();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit User Profile</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Profile Image URL</Label>
                        <Input
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/avatar.jpg"
                            className="w-full"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="emailVerified" className="cursor-pointer">Email Verified</Label>
                        <Switch
                            id="emailVerified"
                            checked={formData.emailVerified}
                            onCheckedChange={handleToggleChange}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="mr-2"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateUser.isPending}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            {updateUser.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditUserForm;