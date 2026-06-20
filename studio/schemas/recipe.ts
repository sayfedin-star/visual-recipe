import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'publicationType',
      title: 'Publication Type',
      type: 'string',
      options: {
        list: [
          { title: 'Single Recipe', value: 'single' },
          { title: 'Round-Up', value: 'roundup' },
        ],
        layout: 'radio',
      },
      initialValue: 'single',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'roundupItems',
      title: 'Round-Up Items',
      type: 'array',
      hidden: ({ document }) => document?.publicationType !== 'roundup',
      of: [
        {
          type: 'object',
          name: 'roundupItem',
          title: 'Round-Up Item',
          fields: [
            defineField({
              name: 'recipe',
              title: 'Linked Recipe',
              type: 'reference',
              to: [{ type: 'recipe' }],
              description: 'Select an internal recipe to feature. (Optional if external)',
            }),
            defineField({
              name: 'title',
              title: 'Custom Title',
              type: 'string',
              description: 'Overrides the recipe title. Required if no recipe is selected.',
              validation: Rule => Rule.custom((value, context) => {
                const parent = context.parent as any;
                if (!parent?.recipe && !value) {
                  return 'Custom Title is required when no internal recipe is linked.';
                }
                return true;
              }),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Write a summary or review of this recipe for the round-up.',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Custom Image',
              type: 'image',
              options: { hotspot: true },
              description: 'Overrides the linked recipe image. Required if no recipe is selected.',
              validation: Rule => Rule.custom((value, context) => {
                const parent = context.parent as any;
                if (!parent?.recipe && !value) {
                  return 'An image is required when no internal recipe is linked.';
                }
                return true;
              }),
            }),
            defineField({
              name: 'externalUrl',
              title: 'External Recipe URL',
              type: 'url',
              description: 'Link directly to an external website instead of the internal detail page.',
            }),
            defineField({
              name: 'customCta',
              title: 'Custom CTA Label',
              type: 'string',
              description: 'Optional override for the CTA button (defaults to "MAKE THIS RECIPE")',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              recipeTitle: 'recipe.title',
              media: 'image',
              recipeMedia: 'recipe.mainImage',
            },
            prepare({ title, recipeTitle, media, recipeMedia }) {
              return {
                title: title || recipeTitle || 'Untitled Item',
                media: media || recipeMedia,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image (Portrait Recommended)',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Required for SEO accessibility validation.',
          validation: Rule => Rule.required().error('Alt text is required for the main image.'),
        }),
      ],
      validation: Rule => Rule.required().error('Main image is required for the recipe.'),
    }),
    defineField({
      name: 'hideMainImage',
      title: 'Hide Main Image in recipe page',
      type: 'boolean',
      description: 'Check this to hide the main hero image on the recipe detail page.',
      initialValue: false,
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Used in recipe cards and meta description.',
      validation: Rule => Rule.required().max(160),
    }),
    defineField({
      name: 'body',
      title: 'Body Content / Introduction',
      type: 'array',
      description: 'Write free-form text, introductions, lists, or headers for this post.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured (Pin to Top)',
      type: 'boolean',
      initialValue: false,
    }),
    // Feed Sorting & Layout Controls
    defineField({
      name: 'priorityScore',
      title: 'Feed Weight / Priority Score',
      type: 'number',
      description: 'Higher numbers sort higher in the discovery feed. Defaults to 0.',
      initialValue: 0,
    }),
    defineField({
      name: 'cardAspectRatio',
      title: 'Card Aspect Ratio / Style',
      type: 'string',
      options: {
        list: [
          { title: 'Standard (4:3)', value: 'standard' },
          { title: 'Tall Portrait (2:3)', value: 'tall' },
          { title: 'Super Tall (1:2)', value: 'super-tall' },
        ],
      },
      initialValue: 'tall',
      description: 'Forces card rendering heights to support masonry variance.',
    }),
    defineField({
      name: 'isEvergreen',
      title: 'Is Evergreen Content',
      type: 'boolean',
      description: 'Evergreen content remains priority in recommendation feeds across seasons.',
      initialValue: true,
    }),
    // Cluster Taxonomy
    defineField({
      name: 'parentCluster',
      title: 'Parent Cluster',
      type: 'reference',
      to: [{ type: 'cluster' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subCluster',
      title: 'Sub-Cluster',
      type: 'reference',
      to: [{ type: 'cluster' }],
    }),
    defineField({
      name: 'adjacentClusters',
      title: 'Adjacent Clusters',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'cluster' }] }],
    }),
    defineField({
      name: 'relatedRecipesManual',
      title: 'Manually Curated Related Recipes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'recipe' }] }],
      description: 'Override automatically calculated related recipes with specific editorial recommendations.',
    }),
    // Filters & Tags
    defineField({
      name: 'intentTags',
      title: 'Intent Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Easy', value: 'easy' },
          { title: 'Quick', value: 'quick' },
          { title: 'Healthy', value: 'healthy' },
          { title: 'Meal Prep', value: 'meal-prep' },
          { title: 'High Protein', value: 'high-protein' },
          { title: 'Dinner', value: 'dinner' },
          { title: 'Lunch', value: 'lunch' },
          { title: 'Family Friendly', value: 'family-friendly' },
          { title: 'One Pan', value: 'one-pan' },
          { title: 'Make Ahead', value: 'make-ahead' },
        ],
      },
    }),
    defineField({
      name: 'season',
      title: 'Season',
      type: 'string',
      options: {
        list: [
          { title: 'All Year', value: 'all-year' },
          { title: 'Spring', value: 'spring' },
          { title: 'Summer', value: 'summer' },
          { title: 'Fall', value: 'fall' },
          { title: 'Winter', value: 'winter' },
        ],
      },
      initialValue: 'all-year',
    }),
    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Stickers shown on recipe cards (e.g. "20 Min", "One Pan", "Gluten Free").',
    }),
    // Metadata
    defineField({
      name: 'prepTime',
      title: 'Prep Time (Minutes)',
      type: 'number',
      hidden: ({ document }) => document?.publicationType === 'roundup',
    }),
    defineField({
      name: 'cookTime',
      title: 'Cook Time (Minutes)',
      type: 'number',
      hidden: ({ document }) => document?.publicationType === 'roundup',
    }),
    defineField({
      name: 'servings',
      title: 'Servings',
      type: 'number',
      hidden: ({ document }) => document?.publicationType === 'roundup',
    }),
    // Ingredient Checklist Groups
    defineField({
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      hidden: ({ document }) => document?.publicationType === 'roundup',
      of: [
        {
          type: 'object',
          name: 'ingredientGroup',
          title: 'Ingredient Group',
          fields: [
            { name: 'groupName', title: 'Group Name (e.g., For the Dressing)', type: 'string' },
            {
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [{ type: 'string' }],
              validation: Rule => Rule.required(),
            },
          ],
        },
      ],
    }),
    // Step-by-Step Instructions
    defineField({
      name: 'instructions',
      title: 'Instructions Steps',
      type: 'array',
      hidden: ({ document }) => document?.publicationType === 'roundup',
      of: [
        {
          type: 'object',
          name: 'step',
          title: 'Step',
          fields: [
            { name: 'stepNumber', title: 'Step Number', type: 'number' },
            { name: 'instructionText', title: 'Instruction Content', type: 'text', validation: Rule => Rule.required() },
            { 
              name: 'stepImage', 
              title: 'Step Image (Optional)', 
              type: 'image', 
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative Text',
                  description: 'Recommended if the image displays cooking state details.',
                }
              ]
            },
          ],
        },
      ],
    }),
    // FAQ Accordion Blocks
    defineField({
      name: 'faq',
      title: 'Frequently Asked Questions',
      type: 'array',
      hidden: ({ document }) => document?.publicationType === 'roundup',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Item',
          fields: [
            { name: 'question', title: 'Question', type: 'string', validation: Rule => Rule.required() },
            { name: 'answer', title: 'Answer', type: 'text', validation: Rule => Rule.required() },
          ],
        },
      ],
    }),
    defineField({
      name: 'externalRecipeUrl',
      title: 'External Recipe URL / Custom CTA Link',
      type: 'url',
      description: 'If set, the CTA button (Jump to Recipe / View Round-Up) will link directly to this URL instead of the default behavior.',
    }),
    defineField({
      name: 'jumpToRecipeAnchor',
      title: 'Jump to Recipe Anchor ID',
      type: 'string',
      initialValue: 'recipe-card',
      description: 'Anchor ID scroll-target on the recipe page.',
      hidden: ({ document }) => document?.publicationType === 'roundup',
    }),
  ],
});
