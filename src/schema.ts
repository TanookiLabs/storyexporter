import {InferInsertModel} from 'drizzle-orm'
import {integer, real, sqliteTable, text} from 'drizzle-orm/sqlite-core'

export const projectTable = sqliteTable('project', {
  id: integer('id').primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status'),
  iterationLength: integer('iteration_length'),
  created_at: text('created_at'),
  updated_at: text('updated_at'),
})

export const storyTable = sqliteTable('story', {
  id: integer('id').primaryKey().notNull(),
  projectId: integer('project_id'),
  name: text('name'),
  description: text('description'),
  storyType: text('story_type'),
  currentState: text('current_state'),
  estimate: real('estimate'),
  acceptedAt: text('accepted_at'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
})

export const personTable = sqliteTable('person', {
  id: integer('id').primaryKey().notNull(),
  name: text('name'),
  email: text('email'),
  initials: text('initials'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
})

export const commentTable = sqliteTable('comment', {
  id: integer('id').primaryKey().notNull(),
  storyId: integer('story_id'),
  text: text('text'),
  personId: integer('person_id'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
})

export const epicTable = sqliteTable('epic', {
  id: integer('id').primaryKey().notNull(),
  projectId: integer('project_id'),
  name: text('name'),
  description: text('description'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
})

export const fileAttachmentTable = sqliteTable('file_attachment', {
  id: integer('id').primaryKey().notNull(),
  storyId: integer('story_id').notNull(),
  filename: text('filename'),
  contentType: text('content_type'),
  size: integer('size'),
  downloadUrl: text('download_url'),
  uploaderId: integer('uploader_id'),
  createdAt: text('created_at'),
})


export type Project = InferInsertModel<typeof projectTable>
export type Story = InferInsertModel<typeof storyTable>
export type Person = InferInsertModel<typeof personTable>
export type Comment = InferInsertModel<typeof commentTable>
export type FileAttachment = InferInsertModel<typeof fileAttachmentTable>
export type Epic = InferInsertModel<typeof epicTable>
