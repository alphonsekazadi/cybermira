import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'detectionTechnique',
  title: 'Detection Technique',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'steps',
      title: 'Verification Steps',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'signals',
      title: 'Expected Signals',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'tools',
      title: 'Recommended Tools',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
})
