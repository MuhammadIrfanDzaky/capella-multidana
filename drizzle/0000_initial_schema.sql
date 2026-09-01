CREATE TABLE `applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer_id` integer NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`tenor_months` integer NOT NULL,
	`monthly_income` integer NOT NULL,
	`notes` text,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "amount_positive" CHECK("applications"."amount" > 0),
	CONSTRAINT "tenor_positive" CHECK("applications"."tenor_months" > 0),
	CONSTRAINT "monthly_income_positive" CHECK("applications"."monthly_income" > 0)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nik` text NOT NULL,
	`full_name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_nik_unique` ON `customers` (`nik`);