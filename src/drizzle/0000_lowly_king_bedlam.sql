CREATE TABLE `comment` (
	`id` integer PRIMARY KEY NOT NULL,
	`story_id` integer NOT NULL,
	`text` text,
	`person_id` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`story_id`) REFERENCES `story`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `epic` (
	`id` integer PRIMARY KEY NOT NULL,
	`project_id` integer NOT NULL,
	`label_id` integer NOT NULL,
	`name` text,
	`description` text,
	`created_at` text,
	`updated_at` text,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`label_id`) REFERENCES `label`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `file_attachment_file` (
	`file_attachment_id` integer NOT NULL,
	`blob` blob NOT NULL,
	FOREIGN KEY (`file_attachment_id`) REFERENCES `file_attachment`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `file_attachment` (
	`id` integer PRIMARY KEY NOT NULL,
	`filename` text,
	`content_type` text,
	`size` integer,
	`download_url` text,
	`uploader_id` integer,
	`created_at` text,
	`comment_id` integer,
	FOREIGN KEY (`comment_id`) REFERENCES `comment`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `label` (
	`id` integer PRIMARY KEY NOT NULL,
	`project_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` text,
	`updated_at` text,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `person` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`initials` text,
	`username` text
);
--> statement-breakpoint
CREATE TABLE `project` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`status` text,
	`iteration_length` integer,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `story_label` (
	`story_id` integer NOT NULL,
	`label_id` integer NOT NULL,
	FOREIGN KEY (`story_id`) REFERENCES `story`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`label_id`) REFERENCES `label`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `story` (
	`id` integer PRIMARY KEY NOT NULL,
	`project_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`story_type` text NOT NULL,
	`current_state` text NOT NULL,
	`estimate` real,
	`accepted_at` text,
	`created_at` text NOT NULL,
	`owned_by_id` integer,
	`requested_by_id` integer NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owned_by_id`) REFERENCES `person`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`requested_by_id`) REFERENCES `person`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `file_attachment_id_idx` ON `file_attachment_file` (`file_attachment_id`);