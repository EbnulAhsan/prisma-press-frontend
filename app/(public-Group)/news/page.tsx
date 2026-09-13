import React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

interface Post {
    id: string;
    title: string;
    content: string;
    thumbnail?: string;
    tags?: string[];
    createdAt: string;
    isPremium: boolean;
}

const NewsPage = async () => {
    // Backend theke posts fetch kora (no-store cache prevent kore instantly fresh post anbe)
    const res = await fetch("http://localhost:5000/api/posts", {
        cache: "no-store",
    });

    const result = await res.json();
    const posts: Post[] = result?.data || [];

    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold mb-8">Latest News</h1>

                {posts.length === 0 ? (
                    <p className="text-muted-foreground">No posts found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md flex flex-col justify-between"
                            >
                                {/* Card Image */}
                                <div className="h-48 w-full bg-muted relative overflow-hidden flex items-center justify-center">
                                    {post.thumbnail ? (
                                        <img
                                            src={post.thumbnail}
                                            alt={post.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm font-medium text-muted-foreground">
                                            No Image
                                        </span>
                                    )}
                                </div>

                                {/* Card Body */}
                                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary capitalize">
                                                {post.tags?.[0] || "General"}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> 5 min read
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-semibold leading-snug text-foreground line-clamp-2">
                                            {post.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mt-2">
                                            {post.content}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-border/50">
                                        <Link
                                            href={`/news/${post.id}`}
                                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                                        >
                                            Read article <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsPage;