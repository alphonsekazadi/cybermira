import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'owaspCategory',
  title: 'OWASP Category',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
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
      rows: 4,
    }),
    defineField({
      name: 'url',
      title: 'Official URL',
      type: 'url',
    }),
  ],
})
