/* eslint-disable @typescript-eslint/no-explicit-any */
import { LucideIcon } from "lucide-react";

export type IPostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type IAuthor = {
    id: string;
    name: string;
    email: string;
    activeStatus: string;
    role: string;
    createdAt: string;
    updatedAt: string;
};

export type IComment = {
    id: string;
    content: string;
    status: string;
    postId: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
};

export type IPost = {
    id: string;
    title: string;
    content: string;
    thumbnail: string | null;
    isFeatured: boolean;
    status: IPostStatus;
    tags: string[];
    views: number;
    isPremium: boolean;
    authorId: string;
    author?: IAuthor;
    comments?: IComment[];
    _count?: {
        comments: number;
    };
    createdAt: string;
    updatedAt: string;
};

export type IUser = {
    data?: {
        profile?: {
            role?: "USER" | "AUTHOR" | "ADMIN" | string;
            [key: string]: any;
        };
        [key: string]: any;
    };
    [key: string]: any;
};

export type NavbarProps = {
    user?: IUser | null;
};

export type ISidebarItem = {
    label: string;
    href: string;
    icon: LucideIcon;
};