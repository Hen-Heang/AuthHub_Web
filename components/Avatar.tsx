import React from "react";

type AvatarProps = {
    children: React.ReactNode
}

export default function Avatar({ children }: AvatarProps) {
    return <div>{children}</div>
}