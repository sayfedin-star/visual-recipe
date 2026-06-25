export interface SanityImage {
  _type?: 'image';
  asset?: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  [key: string]: unknown; // Allow other properties from sanity images
}

export interface Cluster {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: SanityImage;
  parentCluster?: Pick<Cluster, 'title' | 'slug' | '_id'>;
  parentClusterSlug?: string;
}

export interface IngredientGroup {
  groupName?: string;
  items: string[];
}

export interface InstructionStep {
  stepNumber: number;
  instructionText: unknown[]; // Portable text blocks
  stepImage?: SanityImage;
}

export interface FAQItem {
  question: string;
  answer: unknown[]; // Portable text blocks
}

export interface RoundupItem {
  recipe?: {
    _id: string;
    title: string;
    slug: string;
    mainImage: SanityImage;
    excerpt: string;
    cardAspectRatio?: 'standard' | 'tall' | 'super-tall';
    badges?: string[];
    prepTime?: number;
    cookTime?: number;
  };
  title?: string;
  description: string;
  image?: SanityImage;
  externalUrl?: string;
  customCta?: string;
  imageDisplayMode?: 'cover' | 'contain' | 'original';
}

export interface Recipe {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  mainImage: SanityImage;
  publishedAt?: string;
  featured?: boolean;
  priorityScore?: number;
  cardAspectRatio?: 'standard' | 'tall' | 'super-tall';
  badges?: string[];
  intentTags?: string[];
  season?: string;
  publicationType?: 'single' | 'roundup';
  jumpToRecipeAnchor?: string;
  parentCluster?: Pick<Cluster, '_id' | 'title' | 'slug'>;
  subCluster?: Pick<Cluster, '_id' | 'title' | 'slug'>;
  adjacentClusters?: Pick<Cluster, '_id' | 'title' | 'slug'>[];
  relatedRecipesManual?: Partial<Recipe>[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  ingredients?: IngredientGroup[];
  instructions?: InstructionStep[];
  faq?: FAQItem[];
  roundupItems?: RoundupItem[];
  externalRecipeUrl?: string;
  isEvergreen?: boolean;
  hideMainImage?: boolean;
  body?: unknown[]; // Portable text blocks

  // Custom properties added client-side sometimes
  id?: string;
  imageUrl?: string;
  parentClusterSlug?: string;
}
