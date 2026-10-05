const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/components/tasks/TasksView.tsx', 'utf8');

const oldLoading = `{loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredTasks.length === 0 ? (`;

const newLoading = `{loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                <div className="flex gap-4 items-center w-full">
                  <div className="w-5 h-5 rounded-md bg-gray-200 dark:bg-gray-700" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                  <div className="w-16 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (`;

content = content.replace(oldLoading, newLoading);
fs.writeFileSync('C:/ventoo-calendar/src/components/tasks/TasksView.tsx', content);
