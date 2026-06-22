import groq from 'groq';

// Fetch all recipes with cluster references
export const ALL_RECIPES_QUERY = groq`
  *[_type == "recipe"] | order(featured desc, priorityScore desc, publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    publishedAt,
    featured,
    priorityScore,
    cardAspectRatio,
    badges,
    intentTags,
    season,
    "publicationType": coalesce(publicationType, "single"),
    jumpToRecipeAnchor,
    parentCluster->{ title, "slug": slug.current },
    subCluster->{ title, "slug": slug.current },
    adjacentClusters[]->{ title, "slug": slug.current }
  }
`;

// Fetch all clusters for hubs and internal linking
export const ALL_CLUSTERS_QUERY = groq`
  *[_type == "cluster"] {
    _id,
    title,
    "slug": slug.current,
    description,
    coverImage,
    parentCluster->{ title, "slug": slug.current }
  }
`;

// Fetch single recipe by slug with full details
export const RECIPE_BY_SLUG_QUERY = groq`
  *[_type == "recipe" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    excerpt,
    publishedAt,
    featured,
    priorityScore,
    cardAspectRatio,
    isEvergreen,
    hideMainImage,
    "publicationType": coalesce(publicationType, "single"),
    body,
    roundupItems[] {
      recipe->{
        _id,
        title,
        "slug": slug.current,
        mainImage,
        excerpt,
        cardAspectRatio,
        badges,
        prepTime,
        cookTime
      },
      title,
      description,
      image,
      externalUrl,
      customCta,
      imageDisplayMode
    },
    parentCluster->{ _id, title, "slug": slug.current },
    subCluster->{ _id, title, "slug": slug.current },
    adjacentClusters[]->{ _id, title, "slug": slug.current },
    relatedRecipesManual[]->{
      _id,
      title,
      "slug": slug.current,
      mainImage,
      excerpt,
      cardAspectRatio,
      badges,
      "publicationType": coalesce(publicationType, "single"),
      jumpToRecipeAnchor
    },
    intentTags,
    season,
    badges,
    prepTime,
    cookTime,
    servings,
    ingredients[] {
      groupName,
      items
    },
    instructions[] {
      stepNumber,
      instructionText,
      stepImage
    },
    faq[] {
      question,
      answer
    },
    externalRecipeUrl,
    jumpToRecipeAnchor
  }
`;

// Fetch single cluster by slug
export const CLUSTER_BY_SLUG_QUERY = groq`
  *[_type == "cluster" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    coverImage,
    parentCluster->{ title, "slug": slug.current }
  }
`;

// Fetch recipes in a specific cluster (parent, sub, or adjacent)
export const RECIPES_BY_CLUSTER_QUERY = groq`
  *[_type == "recipe" && (
    parentCluster._ref == $clusterId || 
    subCluster._ref == $clusterId || 
    references($clusterId)
  )] | order(featured desc, priorityScore desc, publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    cardAspectRatio,
    badges,
    intentTags,
    season,
    "publicationType": coalesce(publicationType, "single"),
    jumpToRecipeAnchor,
    parentCluster->{ title, "slug": slug.current }
  }
`;

// Fetch auto-calculated related recipes (sharing parent, sub, or adjacent clusters)
export const AUTO_RELATED_RECIPES_QUERY = groq`
  *[_type == "recipe" && _id != $recipeId && (
    parentCluster._ref == $parentId ||
    subCluster._ref == $subId ||
    references($parentId)
  )] | order(priorityScore desc, publishedAt desc)[0...8] {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    excerpt,
    cardAspectRatio,
    badges,
    "publicationType": coalesce(publicationType, "single"),
    jumpToRecipeAnchor
  }
`;

// Fetch only recipe slugs for fast getStaticPaths generation
export const RECIPE_SLUGS_QUERY = groq`
  *[_type == "recipe"] {
    "slug": slug.current
  }
`;

// Fetch minimal fields for client-side search index generation
export const SEARCH_INDEX_QUERY = groq`
  *[_type == "recipe"] | order(featured desc, priorityScore desc, publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    cardAspectRatio,
    badges,
    intentTags,
    season,
    "publicationType": coalesce(publicationType, "single"),
    parentCluster->{ title, "slug": slug.current }
  }
`;
