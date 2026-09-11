import { Suspense } from "react";
import { Sparkles, ShieldCheck, Zap, RefreshCw, HelpCircle } from "lucide-react";
import { PricingSection } from "../_components/payment/PricingSection";
import { PricingSectionLoader } from "../_components/payment/PricingSectionLoader";

const PaymentPage = () => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background py-12 sm:py-20">
            {/* Decorative Background Glows & Pattern */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
                <div
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/30 to-violet-500/20 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
            </div>

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Header Section */}
                <div className="mx-auto max-w-2xl text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase shadow-sm backdrop-blur-md">
                        <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
                        <span>Elevate Your Experience</span>
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
                        Unlock <span className="bg-gradient-to-r from-primary via-violet-500 to-indigo-500 bg-clip-text text-transparent">Premium</span> Insights
                    </h1>

                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        Get unlimited access to award-winning journalism, deep-dive analyses, and ad-free reading on any device.
                    </p>
                </div>

                {/* Pricing Cards Component */}
                <div className="relative">
                    <Suspense fallback={<PricingSectionLoader />}>
                        <PricingSection />
                    </Suspense>
                </div>

                {/* Trust Badges / Guarantees */}
                <div className="pt-6 border-t border-border/60">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center space-y-2 p-3">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <Zap className="h-5 w-5" />
                            </div>
                            <h4 className="text-sm font-semibold text-foreground">Instant Activation</h4>
                            <p className="text-xs text-muted-foreground">Access your premium privileges immediately after checkout.</p>
                        </div>

                        <div className="flex flex-col items-center space-y-2 p-3">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <RefreshCw className="h-5 w-5" />
                            </div>
                            <h4 className="text-sm font-semibold text-foreground">Cancel Anytime</h4>
                            <p className="text-xs text-muted-foreground">No lock-ins or contracts. Easily cancel from your account settings.</p>
                        </div>

                        <div className="flex flex-col items-center space-y-2 p-3">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h4 className="text-sm font-semibold text-foreground">Secure Payment</h4>
                            <p className="text-xs text-muted-foreground">Bank-level 256-bit SSL encryption to keep your data safe.</p>
                        </div>
                    </div>
                </div>

                {/* Support Help Footer */}
                <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5 pt-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Have questions? <a href="/support" className="underline underline-offset-4 hover:text-foreground transition-colors">Talk to our support team</a></span>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;