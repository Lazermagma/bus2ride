// Minimal layout for embed routes - no Navigation or Footer
// This layout completely bypasses the root layout for embed routes
export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Return children directly without any wrapper
  // The embed pages return full HTML documents, so they bypass this layout too
  return <>{children}</>;
}

