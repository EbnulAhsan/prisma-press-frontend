
// import React from "react";

// const NewsPage = () => {
//     return (
//         <div>News-Page</div>
//     )
// }

// export default NewsPage

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const NewsPage = () => {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="mx-auto max-w-sm">
                {/* Simple News Card */}
                <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
                    {/* Card Image Banner */}
                    <div className="h-48 w-full bg-gradient-to-br from-primary/20 via-primary/10 to-muted flex items-center justify-center text-muted-foreground">
                        <span className="text-sm font-medium">News Image</span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                                Tech
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" /> 5 min read
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold leading-snug text-foreground line-clamp-2">
                            News Card
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            Explore the latest developments in server rendering, cache architectures, and reactive components.
                        </p>

                        <div className="pt-2">
                            <Link
                                href="/news/1"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                            >
                                Read article <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default NewsPage;