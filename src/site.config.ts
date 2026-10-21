import configJson from './site.config.json';

export interface SiteConfig {
  name: string;
  domain: string;
  slug: string;
  wordpress: {
    apiUrl: string;
    distributionSlug: string;
  };
}

export const siteConfig: SiteConfig = configJson as SiteConfig;
export default siteConfig;
