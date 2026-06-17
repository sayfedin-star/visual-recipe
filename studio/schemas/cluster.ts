import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'cluster',
  title: 'Interest Cluster',
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
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Used for SEO meta descriptions and hub headers.',
      validation: Rule => Rule.max(160),
    }),
    defineField({
      name: 'parentCluster',
      title: 'Parent Cluster',
      type: 'reference',
      to: [{ type: 'cluster' }],
      description: 'Establish taxonomy hierarchy (e.g. Chicken Soup belongs to Chicken Recipes).',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
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
          validation: Rule => Rule.required().error('Alt text is required for SEO performance.'),
        })
      ],
      validation: Rule => Rule.required().error('Cover image is required for Cluster hubs.'),
    }),
  ],
});
