export type Website = {
  id: number;
  name: string;
  slug: string;
  url: string;
  code: string;
  tcgs: string[];
  meta?: {
    branding?: {  
      icons?: {
        light: string;
        dark: string;
      }
    }
  };
};

export type WebsiteMapping = {
  name: string;
  slug: string;
};
