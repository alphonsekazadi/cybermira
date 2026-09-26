import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'attackPattern',
  title: 'Attack Pattern',
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
      name: 'preconditions',
      title: 'Preconditions',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'indicators',
      title: 'Indicators',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'severity',
      title: 'Typical Severity',
      type: 'string',
      options: {
        list: ['Low', 'Medium', 'High', 'Critical'],
      },
    }),
  ],
})
