import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { cookies } from "next/headers";

interface Post {
    id: string;
    title: string;
    content: string;
    thumbnail?: string;
    tags?: string[];
    createdAt: string;
    isPremium: boolean;
}

const PremiumPage = async () => {
    const cookieStore = await cookies();

    // Cookie theke accessToken ber kora
    const token =
        cookieStore.get("accessToken")?.value ||
        cookieStore.get("token")?.value;

    // Jodi cookie te token-i na thake
    if (!token) {
        return (
            <div className="min-h-screen bg-background p-12 text-center">
                <h2 className="text-2xl font-bold text-amber-500 mb-2">
                    No Token Found in Cookies
                </h2>
                <p className="text-muted-foreground mb-6">
                    Browser cookie-te kono accessToken pawa jayni. Apni ki logged in?
                </p>
                <Link
                    href="/login"
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                    Go to Login
                </Link>
            </div>
        );
    }

    // Backend API hit kora
    const res = await fetch("http://localhost:5000/api/premium", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    const result = await res.json().catch(() => null);

    // Backend error / 401 / 403 / 500 hole screen-e dekhanor jonno
    if (!res.ok) {
        return (
            <div className="min-h-screen bg-background p-12 text-center">
                <h2 className="text-2xl font-bold text-destructive mb-3">
                    Backend Access Denied (Status: {res.status})
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Backend theke premium content access korte deyni. Error details niche deya holo:
                </p>
                <div className="max-w-2xl mx-auto bg-muted p-5 rounded-2xl text-left border border-border">
                    <pre className="text-xs overflow-x-auto text-foreground whitespace-pre-wrap font-mono">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            </div>
        );
    }

    const posts: Post[] = result?.data || [];

    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="mx-auto max-w-6xl">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-6 w-6 text-amber-500" />
                    <span className="text-sm font-semibold tracking-wide text-amber-500 uppercase">
                        Exclusive Area
                    </span>
                </div>
                <h1 className="text-3xl font-bold mb-8">Premium Insights & Articles</h1>

                {posts.length === 0 ? (
                    <p className="text-muted-foreground">No premium articles available at the moment.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="overflow-hidden rounded-2xl border border-amber-500/20 bg-card shadow-sm transition hover:shadow-md flex flex-col justify-between"
                            >
                                {/* Image Banner */}
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
                                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                                        PRO
                                    </span>
                                </div>

                                {/* Body */}
                                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 font-medium text-amber-600 capitalize">
                                                {post.tags?.[0] || "Premium"}
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
                                            href={`/premium/${post.id}`}
                                            className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:underline"
                                        >
                                            Read Exclusive <ArrowRight className="h-4 w-4" />
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

export default PremiumPage;