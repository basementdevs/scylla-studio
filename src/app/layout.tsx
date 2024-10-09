import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@scylla-studio/providers";
import { Toaster } from "sonner";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "ScyllaDB Studio",
	description: "Yes",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${geistSans.variable} ${geistMono.variable} antialiased`}
		>
			<body>
				<Providers>
					<div className="flex flex-col h-dvh text-primary">{children}</div>
					<Toaster richColors />
				</Providers>
			</body>
		</html>
	);
}
