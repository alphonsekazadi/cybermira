import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'mitigation',
  title: 'Mitigation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'priority',
      title: 'Priority',
      type: 'string',
      options: {
        list: ['Low', 'Medium', 'High', 'Critical'],
      },
    }),
    defineField({
      name: 'implementation',
      title: 'Implementation Guidance',
      type: 'text',
      rows: 6,
    }),
  ],
})
