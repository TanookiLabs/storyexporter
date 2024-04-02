CREATE TABLE `comment` (
	`id` integer,
	`story_id` integer,
	`text` text,
	`person_id` integer,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `epic` (
	`id` integer,
	`project_id` integer,
	`name` text,
	`description` text,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `file_attachment` (
	`id` integer,
	`story_id` integer NOT NULL,
	`filename` text,
	`content_type` text,
	`size` integer,
	`download_url` text,
	`uploader_id` integer,
	`created_at` text
);
--> statement-breakpoint
CREATE TABLE `person` (
	`id` integer,
	`name` text,
	`email` text,
	`initials` text,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `project` (
	`id` integer,
	`name` text,
	`description` text,
	`status` text,
	`iteration_length` integer,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `story` (
	`id` integer,
	`project_id` integer,
	`name` text,
	`description` text,
	`story_type` text,
	`current_state` text,
	`estimate` real,
	`accepted_at` text,
	`created_at` text,
	`updated_at` text
);
