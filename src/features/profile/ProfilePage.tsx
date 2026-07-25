import { PageContainer } from "@/components/layout";
import { SectionHeader } from "@/components/ui";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileStats } from "./components/ProfileStats";
import { FriendsPanel } from "./components/FriendsPanel";
import { ActivityFeed } from "./components/ActivityFeed";
import "./profile.css";

/**
 * Profile and the social groundwork: identity, real stats derived from the catch log, a
 * species collection, a local friends list, and an activity feed.
 *
 * Everything here is device-local. The components are shaped the way they'd be with a
 * backend so Tier 2 swaps the data source rather than the UI — but nothing on this page
 * pretends to be networked when it isn't.
 */
export function ProfilePage() {
  return (
    <PageContainer>
      <div className="fk-profile">
        <SectionHeader title="Profile" />
        <ProfileHeader />
        <div className="fk-profile__grid">
          <div className="fk-profile__col">
            <ProfileStats />
          </div>
          <div className="fk-profile__col">
            <FriendsPanel />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
