import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'sourceReference',
  title: 'Source Reference',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publisher',
      title: 'Publisher',
      type: 'string',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          'OWASP',
          'CWE',
          'MITRE',
          'NIST',
          'Vendor Documentation',
          'Research Paper',
          'Other',
        ],
      },
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
    }),
  ],
})
