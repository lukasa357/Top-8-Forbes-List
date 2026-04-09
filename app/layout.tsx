import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
title: 'BizCards - Business Card Directory',
description: 'A community business card directory',
};

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en">
<body className="bg-gray-50 min-h-screen">
<nav className="bg-white shadow-sm p-4 mb-6">
<div className="max-w-4xl mx-auto flex gap-6 items-center">
<a href="/" className="font-bold text-blue-800 text-lg">
BizCards
</a>
<a href="/about" className="text-gray-600 hover:text-blue-600">
About
</a>
</div>
</nav>
<main className="max-w-4xl mx-auto px-4 pb-12">{children}</main>
</body>
</html>
);
}
