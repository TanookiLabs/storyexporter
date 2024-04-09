CREATE TABLE `blocker` (
	`id` integer PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`resolved` integer NOT NULL,
	`story_id` integer NOT NULL,
	`person_id` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`story_id`) REFERENCES `story`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON UPDATE no action ON DELETE no action
);
