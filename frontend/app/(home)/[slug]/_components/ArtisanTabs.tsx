"use client";

import { Tabs } from "@mantine/core";
import type { Artisan } from "@/app/lib/services/artisan";
import { OverviewTab } from "./tabs/OverviewTab";
import { ServicesTab } from "./tabs/ServicesTab";
import { ReviewsTab } from "./tabs/ReviewsTab";
import { PhotosTab } from "./tabs/PhotosTab";

interface ArtisanTabsProps {
  artisan: Artisan;
}

export function ArtisanTabs({ artisan }: ArtisanTabsProps) {
  return (
    <Tabs defaultValue="overview" className="mt-6">
      <Tabs.List>
        <Tabs.Tab value="overview">Vue d'ensemble</Tabs.Tab>
        <Tabs.Tab value="services">Services</Tabs.Tab>
        <Tabs.Tab value="reviews">Avis</Tabs.Tab>
        <Tabs.Tab value="photos">Photos</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="overview" pt="md">
        <OverviewTab artisan={artisan} />
      </Tabs.Panel>

      <Tabs.Panel value="services" pt="md">
        <ServicesTab artisan={artisan} />
      </Tabs.Panel>

      <Tabs.Panel value="reviews" pt="md">
        <ReviewsTab artisan={artisan} />
      </Tabs.Panel>

      <Tabs.Panel value="photos" pt="md">
        <PhotosTab artisan={artisan} />
      </Tabs.Panel>
    </Tabs>
  );
}
