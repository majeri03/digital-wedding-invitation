import InvitationClient from "./InvitationClient";

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string; side?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slug = resolvedParams.slug;
  const guestName = resolvedSearchParams.to
    ? decodeURIComponent(resolvedSearchParams.to).replace(/-/g, " ")
    : "Tamu Kehormatan";
  const family = resolvedSearchParams.side === "wanita" ? "wanita" : "pria";

  return <InvitationClient guestName={guestName} family={family} slug={slug} />;
}
