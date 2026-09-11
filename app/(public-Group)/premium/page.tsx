import { Suspense } from "react";
import Link from "next/link";
import {
    Crown,
    Sparkles,
    Flame,
    Clock,
    ArrowUpRight,
    ShieldCheck,
    TrendingUp,
    BookOpen
} from "lucide-react";
import { NewsSearchBar } from "../_components/news/NewsSearchBar";
import { NewsSkeleton } from "../_components/news/NewsSkeleton";
import { PremiumNewsList } from "../_components/news/PremiumNewsList";

const PremiumPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background py-8 sm:py-12">
            {/* Ambient Glow / Background Gradient */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
                <div
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                    className="relative left-[calc(50%-12rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/30 to-violet-500/20 opacity-40 sm:left-[calc(50%-32rem)] sm:w-[72.1875rem]"
                />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header & Controls Section */}
                <div className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-xl shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        {/* Titles & Tag */}
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary shadow-xs backdrop-blur-md">
                                <Crown className="h-3.5 w-3.5 text-primary" />
                                <span>Subscriber Exclusive</span>
                            </div>

                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                                    Premium{" "}
                                    <span className="bg-gradient-to-r from-primary via-violet-500 to-indigo-500 bg-clip-text text-transparent">
                                        Dispatches
                                    </span>
                                </h1>
                                <p className="mt-1 text-sm sm:text-base text-muted-foreground max-w-xl">
                                    Curated investigative journalism, expert market breakdowns, and in-depth stories unlocked just for you.
                                </p>
                            </div>
                        </div>

                        {/* Search Bar & Actions Wrapper */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                            <div className="w-full sm:w-80">
                                <NewsSearchBar />
                            </div>
                        </div>
                    </div>

                    {/* Quick Filter / Status Ribbon */}
                    <div className="mt-6 pt-5 border-t border-border/50 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Updated real-time with member-only editions</span>
                        </div>
                        <div className="flex items-center gap-1 text-foreground/80 font-medium">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            <span>Full read privileges enabled</span>
                        </div>
                    </div>
                </div>

                {/* Highlighted Spotlight / Editor's Pick Card */}
                <div className="group relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card/80 via-card/50 to-primary/5 p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-primary/40 hover:shadow-xl sm:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-3 max-w-2xl">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500 border border-amber-500/20">
                                    <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                    Editors Choice
                                </span>
                                <span className="text-xs text-muted-foreground">• 8 min deep dive</span>
                            </div>

                            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl group-hover:text-primary transition-colors">
                                The Sovereign Compute Revolution: How Nations Are Building Isolated AI Clusters
                            </h2>

                            <p className="text-sm text-muted-foreground leading-relaxed">
                                An exclusive investigation into governmental data silos, private models, and how global privacy regulations are transforming the international tech supply chain.
                            </p>

                            <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" /> Published 2 hours ago
                                </span>
                                <span className="flex items-center gap-1">
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Verified Briefing
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 shrink-0 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-8">
                            <div className="text-left md:text-right">
                                <span className="text-xs font-medium text-muted-foreground">Access Level</span>
                                <div className="font-semibold text-primary text-sm flex items-center gap-1">
                                    <Crown className="h-3.5 w-3.5" /> All Subscribers
                                </div>
                            </div>

                            <Link
                                href="#read-spotlight"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                            >
                                Read Analysis <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="relative space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            All Member Stories
                        </h3>
                        <span className="text-xs text-muted-foreground">Filtered for active members</span>
                    </div>

                    <Suspense fallback={<NewsSkeleton />}>
                        <PremiumNewsList searchParams={searchParams} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default PremiumPage;