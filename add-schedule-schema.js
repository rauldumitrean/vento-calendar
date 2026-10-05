const fs = require('fs');
let content = fs.readFileSync('src/lib/db/schema.ts', 'utf8');

const scheduleSchema = `
// -- Schedules ----------------------------------------------------------
export const schedules = pgTable("calendar_schedules", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  location: text("location"),
  color: text("color").notNull().default("blue"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
`;

if (!content.includes('calendar_schedules')) {
  content += scheduleSchema;
  fs.writeFileSync('src/lib/db/schema.ts', content);
}
